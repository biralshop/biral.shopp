const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/chat', (req, res) => {
  const { messages } = req.body;
  
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'AI API Key not configured' });
  }

  const systemPrompt = `Sən BiralStore mağazasının rəsmi süni intellektli premium alış-veriş köməkçisisən. Adın BiralAI-dır. 
Mağaza haqqında məlumat:
- BiralStore innovativ ev, mətbəx, maşın aksesuarları və premium həyat tərzi məhsulları satır.
- Brend dəyərlərimiz: Keyfiyyət, İnnovasiya və Müştəri Məmnuniyyəti.
- Aktiv kupon: "BIRAL10" (ilk sifarişə 10% endirim).
- Çatdırılma: Bakı daxili 1-2 gün, sürətli və təhlükəsiz.
- Saytın rəsmi domeni: biral.store.

Təlimatlar:
1. Müştərilərlə hər zaman professional, nəzakətli və premium tərzdə danış.
2. Suallara Azərbaycan dilində cavab ver (əgər müştəri başqa dildə yazmasa).
3. Məhsul tövsiyə edərkən onların həyatını necə asanlaşdıracağını vurğula.
4. BIRAL10 kuponunu xatırlat.
5. Qısa və konkret cavablar verməyə çalış, amma səmimiyyəti qoru.`;

  // Using gpt-4o as it is verified to be active and working for your completions.me account.
  // This provides immediate high-quality AI assistance for your customers.
  const postData = JSON.stringify({
    model: 'gpt-4o', 
    messages: [
      { role: 'system', content: systemPrompt },
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
          console.error(`AI Provider Error: ${aiRes.statusCode}`, body);
          let errorInfo = 'Xəta baş verdi';
          try {
             const errJson = JSON.parse(body);
             errorInfo = errJson.error?.message || body;
          } catch(e) { errorInfo = body; }
          
          return res.status(aiRes.statusCode).json({ error: `AI error`, details: errorInfo });
        }
        const data = JSON.parse(body);
        if (!data.choices || !data.choices[0]) {
          return res.status(500).json({ error: 'Unexpected response format' });
        }
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
