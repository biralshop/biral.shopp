const https = require('https');

const CLAUDE_API_KEY = 'sk-cp_a39ae2af3f52bc82bda131f007c853486abc3da00278d6ef';

const tests = [
  { host: 'completions.me', path: '/v1/chat/completions' },
  { host: 'completions.me', path: '/api/v1/chat/completions' },
  { host: 'completions.me', path: '/chat/completions' },
  { host: 'api.openai.com', path: '/v1/chat/completions' }, // Just to check key on OpenAI again
  { host: 'v1.api.completions.me', path: '/v1/chat/completions' },
  { host: 'api.completions.me', path: '/v1/chat/completions' }
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    console.log(`--- Testing Endpoint: https://${test.host}${test.path} ---`);
    const postData = JSON.stringify({
      model: 'claude-opus-4.6',
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 5
    });

    const options = {
      hostname: test.host,
      port: 443,
      path: test.path,
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
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log(`SUCCESS! Found working endpoint: https://${test.host}${test.path}`);
          resolve(true);
        } else {
          console.log(`Failed: ${body.substring(0, 100)}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`Error: ${e.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`Timeout`);
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  for (const test of tests) {
    const success = await testEndpoint(test);
    if (success) break;
  }
}

runTests();
