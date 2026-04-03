const https = require('https');

const CLAUDE_API_KEY = 'sk-cp_a39ae2af3f52bc82bda131f007c853486abc3da00278d6ef';
const HOST = 'completions.me';
const PATH = '/api/v1/chat/completions';

// More specific/vendor names for Claude
const models = [
  'anthropic/claude-3-opus',
  'anthropic/claude-3.5-sonnet',
  'claude-v3-opus',
  'claude-v3-sonnet',
  'anthropic-claude-3-opus',
  'claude'
];

async function testModel(modelName) {
  return new Promise((resolve) => {
    console.log(`--- Testing Model: ${modelName} ---`);
    const postData = JSON.stringify({
      model: modelName,
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 5
    });

    const options = {
      hostname: HOST,
      port: 443,
      path: PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLAUDE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`SUCCESS! Found Claude as: ${modelName}`);
          resolve(true);
        } else {
          console.log(`Failed ${modelName}: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => { resolve(false); });
    req.write(postData);
    req.end();
  });
}

async function runTests() {
  for (const model of models) {
    const success = await testModel(model);
    if (success) break;
  }
}

runTests();
