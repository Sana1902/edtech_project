const express = require('express');
const { protect } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

router.post('/send', protect, async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'GEMINI_API_KEY not configured' });
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Simple chat: prepend brief system guidance
    const systemPrompt = 'You are a helpful career guidance assistant for Maharashtra students. Keep replies concise and helpful.';
    const parts = [{ text: systemPrompt }];
    if (Array.isArray(history)) {
      history.forEach(h => {
        if (h && typeof h.role === 'string' && typeof h.text === 'string') {
          parts.push({ text: `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}` });
        }
      });
    }
    parts.push({ text: `User: ${message}` });

    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    const text = result.response?.text?.() || result.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return res.json({ success: true, reply: text });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ success: false, message: 'Chat failed', error: err.message });
  }
});

module.exports = router;
