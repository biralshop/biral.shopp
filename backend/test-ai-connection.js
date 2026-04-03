require('dotenv').config();
const https = require('https');

console.log('--- BiralAI Connection Test ---');
console.log('Model:', process.env.CLAUDE_MODEL || 'claude-opus-4.6');
console.log('API Key exists:', !!process.env.CLAUDE_API_KEY);
console.log('API Key prefix:', process.env.CLAUDE_API_KEY ? process.env.CLAUDE_API_KEY.substring(0, 7) : 'N/A');

const postData = JSON.stringify({
  model: process.env.CLAUDE_MODEL || 'claude-opus-4.6',
  messages: [{ role: 'user', content: 'Say hello' }],
  max_tokens: 10
});

const options = {
  hostname: 'api.completions.me',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 10000
};

console.log('Requesting:', `https://${options.hostname}${options.path}`);

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log('Response Body:', body);
    try {
      const json = JSON.parse(body);
      console.log('JSON Parse: Success');
    } catch (e) {
      console.log('JSON Parse: Failed');
    }
  });
});

req.on('error', (e) => {
  console.error('Network Error:', e.message);
  console.error('Full Error:', e);
});

req.on('timeout', () => {
  console.error('Request Timed Out');
  req.destroy();
});

req.write(postData);
req.end();
