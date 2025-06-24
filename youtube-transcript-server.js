// youtube-transcript-server.js
// Simple Express server to fetch YouTube video transcripts using youtube-transcript npm package

const express = require('express');
const cors = require('cors');
const { transcript } = require('youtube-transcript');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`YouTube Transcript Server running on port ${PORT}`);
}); 