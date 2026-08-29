// Vercel Serverless Function — Audio STT via Groq Whisper API
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    return res.status(200).json({
      fallback: true,
      text: '',
      message: 'GROQ_API_KEY not set in Vercel environment variables.'
    });
  }

  try {
    // Parse multipart form data
    const form = new IncomingForm({ keepExtensions: true });
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const audioFile = files.file?.[0] || files.file;
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file received' });
    }

    // Proxy audio to Groq Whisper API
    const fileBuffer = fs.readFileSync(audioFile.filepath || audioFile.path);
    const blob = new Blob([fileBuffer], { type: audioFile.mimetype || 'audio/wav' });

    const formData = new FormData();
    formData.append('file', blob, audioFile.originalFilename || 'audio.wav');
    formData.append('model', 'whisper-large-v3-turbo');

    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqKey}` },
      body: formData
    });

    if (!groqResponse.ok) {
      const errorBody = await groqResponse.text();
      console.error('Groq STT error:', errorBody);
      return res.status(200).json({ text: '', error: 'Groq STT API error', details: errorBody });
    }

    const data = await groqResponse.json();
    return res.status(200).json({ success: true, text: data.text || '' });

  } catch (err) {
    console.error('STT handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
