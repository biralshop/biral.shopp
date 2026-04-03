const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/chat', (req, res) => {
  const { messages, persona } = req.body;
  
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'AI API Key not configured' });
  }

  // Define System Prompts for different personas
  const SUPPORT_PROMPT = `Sən BiralStore mağazasının rəsmi Dəstək Xidməti botusan. 
Sənin vəzifən YALNIZ sifariş statusu, çatdırılma yubanması, endirim kodları və ümumi texniki suallara cavab verməkdir.

KRİTİK TƏLİMAT:
Əgər müştəri məhsul axtarırsa, məhsul tövsiyəsi istəyirsə və ya "Filan məhsul varmı?" kimi suallar verirsə, YALNIZ və YALNIZ bu cavabı ver:
"BIRALbot-a göndərdim indi bu dəqiqə cavab verəcək"
Başqa heç nə yazma.`;

  const SALES_PROMPT = `Sən BiralStore mağazasının professional Satış Mütəxəssisisən. Sən qara kostyumlu, səliqəli və elit bir satış mütəxəssisisən.
Sənin vəzifən müştərinin ehtiyaclarına uyğun ən yaxşı məhsulları tapmaq və tövsiyə etməkdir.

TƏLİMATLAR:
1. Müştəriyə məhsul tapdıqda onu [[PRODUCT:id]] formatında cavabına əlavə et. 
2. Müştəri ilə çox nəzakətli və satış odaklı danış.
3. BIRAL10 kuponunu xatırlada bilərsən.

Məhsul Kataloqumuz (Simplifed):
- id: 1 - Silikon Mətbəx Alətləri Dəsti (29.99 AZN)
- id: 2 - Avtomatik Bitki Sulama Sistemi (18.50 AZN)
- id: 4 - Universal Maşın Telefon Tutucusu (12.99 AZN)
- id: 6 - Solar Baxça İşıqları (22.99 AZN)
- id: 9 - Elektrikli Bibər Dəyirmanı (19.99 AZN)
- id: 10 - Simsiz Maşın Tozsoran (34.99 AZN)
- id: 12 - Maqnitli Bıçaq Tutucusu (11.99 AZN)`;

  const currentSystemPrompt = persona === 'sales' ? SALES_PROMPT : SUPPORT_PROMPT;

  const postData = JSON.stringify({
    model: 'gpt-4o', 
    messages: [
      { role: 'system', content: currentSystemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1000
  });

  const options = {
    hostname: 'completions.me',
    port: 443,
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000 
  };

  const aiReq = https.request(options, (aiRes) => {
    let body = '';
    aiRes.setEncoding('utf8');
    aiRes.on('data', (chunk) => { body += chunk; });
    aiRes.on('end', () => {
      try {
        if (aiRes.statusCode !== 200) {
          return res.status(aiRes.statusCode).json({ error: 'AI service error', details: body });
        }
        const data = JSON.parse(body);
        res.json({ message: data.choices[0].message.content });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse AI response' });
      }
    });
  });

  aiReq.on('error', (e) => {
    res.status(500).json({ error: 'Connection to AI failed', details: e.message });
  });

  aiReq.write(postData);
  aiReq.end();
});

module.exports = router;
