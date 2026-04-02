require('dotenv').config({ path: './backend/.env' });
const jwt = require('jsonwebtoken');
const https = require('https');

const token = jwt.sign({ userId: 'test' }, process.env.JWT_SECRET || 'fallback_secret_if_none');

const data = JSON.stringify({
  title: 'Test',
  slug: 'test-2',
  excerpt: 'A',
  content: 'B',
  image: 'C',
  status: 'active',
  relatedProducts: []
});

const req = https.request('https://biralstore-api.onrender.com/api/articles', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let d = '';
  res.on('data', c => d+=c);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', d));
});
req.write(data);
req.end();
