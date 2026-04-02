const fs = require('fs');
const https = require('https');
const path = require('path');
const { execSync } = require('child_process');

const url = 'https://download.geonames.org/export/zip/AZ.zip';
const zipPath = path.join(__dirname, 'AZ.zip');
const txtPath = path.join(__dirname, 'AZ.txt');
const outPath = path.join(__dirname, 'src', 'data', 'azpost.json');

console.log('Downloading AZ.zip...');
https.get(url, (response) => {
  const file = fs.createWriteStream(zipPath);
  response.pipe(file);
  file.on('finish', () => {
    file.close((err) => {
      console.log('Extracted AZ.zip');
      
      try {
        execSync('Expand-Archive -Path AZ.zip -DestinationPath . -Force', { shell: 'powershell.exe' });
        console.log('Extracted successfully.');
      } catch (e) {
        console.log('PowerShell extract failed:', e.message);
      }

      if (fs.existsSync(txtPath)) {
        const data = fs.readFileSync(txtPath, 'utf8');
        const lines = data.split('\n');
        const results = [];
        const uniqueKeys = new Set();
        
        lines.forEach(line => {
          if (!line.trim()) return;
          const parts = line.split('\t');
          const zip = parts[1];
          const place = parts[2] || '';
          const region = parts[3] || ''; // admin name1
          const adminName2 = parts[5] || '';
          
          if (region.toLowerCase().includes('baki') || region.toLowerCase().includes('baku') || region.toLowerCase().includes('bakı')) return;
          if (place.toLowerCase().includes('baki') || place.toLowerCase().includes('baku') || place.toLowerCase().includes('bakı')) return;
          
          const title = place.length > 2 ? place : (adminName2 || region);
          const fullTitle = `${region ? region + ' - ' : ''}${title} (${zip})`;
          
          if (!uniqueKeys.has(zip)) {
            uniqueKeys.add(zip);
            results.push({
              region: region || adminName2 || place,
              branch: title,
              zip: zip,
              label: fullTitle
            });
          }
        });
        
        // Add specific major ones just in case geonames is lacking
        results.push({ region: "Lənkəran", branch: "Mərkəzi Poçt (Lənkəran)", zip: "AZ4200", label: "Lənkəran - Mərkəzi Poçt (AZ4200)" });
        results.push({ region: "Gəncə", branch: "Mərkəzi Poçt (Gəncə)", zip: "AZ2000", label: "Gəncə - Mərkəzi Poçt (AZ2000)" });
        results.push({ region: "Sumqayıt", branch: "Mərkəzi Poçt (Sumqayıt)", zip: "AZ5000", label: "Sumqayıt - Mərkəzi Poçt (AZ5000)" });
        
        console.log('Total entries found (excluding Baku):', results.length);
        fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
        console.log('Saved to src/data/azpost.json');
        
        fs.unlinkSync(zipPath);
        fs.unlinkSync(txtPath);
        if (fs.existsSync('readme.txt')) fs.unlinkSync('readme.txt');
      } else {
        console.error('AZ.txt not found after extraction.');
      }
    });
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
