const https = require('https');

https.get('https://biralstore-api.onrender.com/api/articles', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => console.log('STATUS:', res.statusCode, '\nBODY START===\n', data.substring(0, 500), '\nBODY END==='));
});
