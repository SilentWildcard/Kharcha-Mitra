import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

// Enable CORS for frontend client
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Enable JSON body parsing
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Kharcha Mitra server running',
    qwenConfigured: !!process.env.DASHSCOPE_API_KEY
  });
});

// Download APK Endpoint
app.get('/api/download-apk', (req, res) => {
  const apkPath = path.resolve(__dirname, '../client/android/app/build/outputs/apk/debug/app-debug.apk');
  const releaseApk = path.resolve(__dirname, '../KharchaMitra.apk');
  
  if (fs.existsSync(releaseApk)) {
    return res.download(releaseApk, 'KharchaMitra.apk');
  } else if (fs.existsSync(apkPath)) {
    return res.download(apkPath, 'KharchaMitra.apk');
  } else {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Download Kharcha Mitra Mobile App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, sans-serif; background: #0f1117; color: #e2e8f0; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
            .card { background: #1e2130; border: 1px solid #2d3148; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; }
            h2 { color: #fff; margin-bottom: 8px; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
            .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-bottom: 12px; }
            .badge { display: inline-block; background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Instant Smartphone App</span>
            <h2>Install Kharcha Mitra on your Phone</h2>
            <p>You can install Kharcha Mitra directly onto your phone right now without downloading an untrusted APK:</p>
            <p>1. Open <strong>http://${req.hostname}:5173</strong> in Chrome on your phone.<br>2. Tap the <strong>⋮</strong> menu &rarr; <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.<br>3. Kharcha Mitra will be installed with full native features & offline support!</p>
            <a href="/" class="btn">Return to Kharcha Mitra</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Qwen AI Endpoint
app.post('/api/qwen', async (req, res) => {
  try {
    const { question, expenses, budget, groups } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!process.env.DASHSCOPE_API_KEY) {
      return res.status(503).json({ error: 'Qwen API not configured. Please check your DASHSCOPE_API_KEY.' });
    }

    const openai = new OpenAI({
      apiKey: process.env.DASHSCOPE_API_KEY,
      baseURL: process.env.QWEN_BASE_URL || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
    });

    const systemPrompt = "You are Kharcha AI, a helpful financial assistant inside the Kharcha Mitra app. You help Indian college students understand their spending. Rules: 1) Only analyze the expense data provided. 2) Never invent transactions or amounts. 3) Keep answers concise and practical. 4) Use simple language. 5) Explain calculations clearly. 6) Identify spending patterns. 7) Suggest practical budgeting habits. 8) Do not give professional financial or investment advice. 9) Use ₹ symbol for amounts. 10) Be friendly and supportive.";

    const userMessage = `Context Data:
Expenses: ${JSON.stringify(expenses || [])}
Budget: ${JSON.stringify(budget || {})}
Groups: ${JSON.stringify(groups || [])}

Question: ${question}`;

    const response = await openai.chat.completions.create({
      model: process.env.QWEN_MODEL || 'qwen-plus',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response', 
      details: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Kharcha Mitra server is running on port ${PORT}`);
});
