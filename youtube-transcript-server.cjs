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
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Analyze the product: ${productName}. Return a JSON object with a 'product' key containing id, name, and a 'features' object with feature names as keys and {rating, sentiment} as values.` }] }]
      })
    });
    const geminiData = await geminiRes.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));
    // Try to extract the JSON from the Gemini response
    let product = null;
    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts[0]?.text) {
      try {
        const match = geminiData.candidates[0].content.parts[0].text.match(/\{[\s\S]*\}/);
        if (match) {
          product = JSON.parse(match[0]);
        }
      } catch (e) {
        console.error('Failed to parse Gemini response text:', e);
      }
    }
    if (!product) {
      console.error('Failed to parse Gemini response:', geminiData);
      return res.status(500).json({ error: 'Failed to parse Gemini response', geminiData });
    }
    res.json(product);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`YouTube Transcript Server running on port ${PORT}`);
}); 