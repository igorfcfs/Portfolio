/**
 * Minimal local dev server for the chat function.
 * Reads GEMINI_API_KEY from .env and proxies requests to Gemini API.
 * Run with: node dev-chat-server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const [key, ...val] = line.split('=');
      if (key && val.length) process.env[key.trim()] = val.join('=').trim();
    });
}

// Import the framework-agnostic core logic from the Vercel function
const { generateReply } = require('./api/chat');

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  // CORS for all origins (local dev only)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    try {
      const { messages, locale } = JSON.parse(body || '{}');
      const { status, payload } = await generateReply({ messages, locale });
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ Chat dev server running at http://localhost:${PORT}`);
  console.log(`   API key loaded: ${process.env.GEMINI_API_KEY ? 'YES ✓' : 'NO ✗'}\n`);
});
