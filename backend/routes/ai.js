const express = require('express');
const router = express.Router();
const https = require('https');

router.post('/chat', (req, res) => {
  const { messages } = req.body;
  
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'AI API Key not configured' });
  }

  const systemPrompt = `Sən BiralStore mağazasının rəsmi süni intellektli premium alış-veriş köməkçisisən. Adın BiralAI-dır. 
Sən Claude 4.6 Opus modelinə əsaslanırsan. 
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

  const postData = JSON.stringify({
    model: process.env.CLAUDE_MODEL || 'claude-opus-4.6',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 1000
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
    timeout: 30000 // 30 seconds timeout
  };

  const aiReq = https.request(options, (aiRes) => {
    let body = '';
    aiRes.setEncoding('utf8');
    aiRes.on('data', (chunk) => { body += chunk; });
    aiRes.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data.error) {
          console.error('AI Provider Error:', data.error);
          return res.status(500).json({ error: 'AI service error', details: data.error });
        }
        if (!data.choices || !data.choices[0]) {
          console.error('Unexpected AI Structure:', data);
          return res.status(500).json({ error: 'Unexpected response', raw: data });
        }
        res.json({ message: data.choices[0].message.content });
      } catch (e) {
        console.error('JSON Parse Error:', body);
        res.status(500).json({ error: 'Failed to parse AI response', raw: body });
      }
    });
  });

  aiReq.on('error', (e) => {
    console.error('HTTPS Request Error:', e);
    res.status(500).json({ error: 'Request to AI failed', details: e.message });
  });

  aiReq.on('timeout', () => {
    aiReq.destroy();
    res.status(504).json({ error: 'AI Provider timeout' });
  });

  aiReq.write(postData);
  aiReq.end();
});

module.exports = router;
