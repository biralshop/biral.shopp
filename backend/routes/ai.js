const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { messages } = req.body;
  
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'AI API Key not configured' });
  }

  try {
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

    console.log('Calling AI Assistant with model:', process.env.CLAUDE_MODEL);

    const response = await fetch('https://api.completions.me/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-opus-4.6',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('AI Provider Error Detail:', JSON.stringify(data.error, null, 2));
      return res.status(500).json({ error: 'AI service error', details: data.error });
    }

    if (!data.choices || !data.choices[0]) {
      console.error('Unexpected AI Response Structure:', data);
      return res.status(500).json({ error: 'Unexpected response format' });
    }

    res.json({ message: data.choices[0].message.content });
  } catch (error) {
    console.error('AI Route Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
