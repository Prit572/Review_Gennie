// youtube-transcript-server.js
// Simple Express server to fetch YouTube video transcripts using youtube-transcript npm package

const express = require('express');
const cors = require('cors');
const { transcript } = require('youtube-transcript');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json()); // for parsing application/json

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchYouTubeReviews(productName) {
  if (!YOUTUBE_API_KEY) return [];
  const query = encodeURIComponent(`${productName} review`);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${YOUTUBE_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items) return [];
    return data.items.map(item => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
  } catch (e) {
    console.error('YouTube API error:', e);
    return [];
  }
}

async function fetchTranscript(videoId) {
  try {
    const res = await fetch(`http://localhost:4000/api/transcript?videoId=${videoId}`);
    const data = await res.json();
    return data.transcript || '';
  } catch (e) {
    console.error('Transcript fetch error:', e);
    return '';
  }
}

app.get('/api/transcript', async (req, res) => {
  const videoId = req.query.videoId;
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId parameter' });
  }
  try {
    const segments = await transcript(videoId);
    // Join all segments into a single transcript string
    const fullTranscript = segments.map(seg => seg.text).join(' ');
    res.json({ transcript: fullTranscript, segments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Gemini proxy endpoint
app.post('/api/gemini-analyze', async (req, res) => {
  const { productName } = req.body;
  if (!productName) {
    return res.status(400).json({ error: 'Missing productName in request body' });
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not set in environment');
    return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment' });
  }
  try {
    // Fetch YouTube reviews first
    const ytReviews = await fetchYouTubeReviews(productName);
    console.log('YouTube reviews:', ytReviews);
    if (!ytReviews || ytReviews.length === 0) {
      console.warn('No YouTube reviews found for:', productName);
    }
    // Fetch transcripts for the top 3 videos (to limit token usage)
    let combinedTranscript = '';
    for (let i = 0; i < Math.min(3, ytReviews.length); i++) {
      const videoId = ytReviews[i].url.split('v=')[1];
      const transcript = await fetchTranscript(videoId);
      combinedTranscript += `\n[Transcript for: ${ytReviews[i].title}]\n${transcript}`;
    }
    // Prompt Gemini with the actual transcript(s)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const prompt = `Analyze the following YouTube review transcripts for the product \"${productName}\":\n${combinedTranscript}\nReturn ONLY a JSON object with this structure:\n{\n  \"product\": {\n    \"id\": \"string\",\n    \"name\": \"string\",\n    \"features\": {\n      \"FeatureName1\": {\n        \"rating\": number,\n        \"sentiment\": \"positive|neutral|negative\",\n        \"pros\": [\"string\", ...],\n        \"cons\": [\"string\", ...],\n        \"keyQuotes\": [\"string\", ...]\n      }\n      // ...more features\n    },\n    \"sourceReviews\": [\n      { \"title\": \"string\", \"url\": \"string\" }\n      // ...up to 10\n    ]\n  }\n}\nDo not include any explanation or text outside the JSON.`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const geminiData = await geminiRes.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    // Try to extract the JSON from the Gemini response
    let product = null;
    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts[0]?.text) {
      try {
        // Try to find the first JSON object in the response
        const match = geminiData.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
        if (match) {
          product = JSON.parse(match[0]);
        }
      } catch (e) {
        console.error('Failed to parse Gemini response text:', e);
      }
    }
    // Always use the real YouTube reviews for sourceReviews
    if (product && product.product) {
      product.product.sourceReviews = ytReviews;
    }
    // Validate required fields
    if (!product || !product.product || !product.product.features || !product.product.sourceReviews) {
      console.error('Failed to parse Gemini response or missing fields:', geminiData);
      return res.status(500).json({ error: 'Failed to parse Gemini response or missing fields', geminiData });
    }
    res.json(product);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-youtube-reviews', async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }
  const ytReviews = await fetchYouTubeReviews(query);
  res.json({ ytReviews });
});

app.listen(PORT, () => {
  console.log(`YouTube Transcript Server running on port ${PORT}`);
}); 