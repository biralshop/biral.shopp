import fs from 'fs';
import path from 'path';
import https from 'https';

const API_URL = 'https://biralstore-api.onrender.com/sitemap.xml';
const FILE_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');

console.log('Fetching dynamic sitemap from backend...');

https.get(API_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Status Code: ${res.statusCode}`);
    return;
  }

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    fs.writeFileSync(FILE_PATH, data);
    console.log('✅ Sitemap successfully saved to public/sitemap.xml');
  });
}).on('error', (err) => {
  console.error('Error fetching sitemap:', err.message);
});
