const https = require('https');

// Hardcoded for test only from the verified backend/.env
const CLAUDE_API_KEY = 'sk-cp_a39ae2af3f52bc82bda131f007c853486abc3da00278d6ef';

const hosts = [
  'api.completions.me',
  'v1.completions.me',
  'completions.me',
  'openai.completions.me',
  'api.openai.com'
];

async function testHost(hostname) {
  return new Promise((resolve) => {
    console.log(`--- Testing Host: ${hostname} ---`);
    const postData = JSON.stringify({
      model: 'claude-opus-4.6',
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 5
    });

    const options = {
      hostname: hostname,
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CLAUDE_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode} for ${hostname}`);
        if (res.statusCode === 200) {
          console.log(`SUCCESS! Found working host: ${hostname}`);
          console.log('Response Snippet:', body.substring(0, 50));
          resolve(true);
        } else {
          console.log(`Failed with status ${res.statusCode}: ${body.substring(0, 50)}`);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`Error for ${hostname}: ${e.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`Timeout for ${hostname}`);
      req.destroy();
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  for (const host of hosts) {
    const success = await testHost(host);
    if (success) break;
  }
}

runTests();
