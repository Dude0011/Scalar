// Vercel Serverless Function — Agent Reasoning Endpoint (Fireworks AI Llama 3.3)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const fireworksKey = process.env.FIREWORKS_API_KEY || req.headers['authorization']?.replace('Bearer ', '');
  const { transcript, catalogItems, mode } = req.body || {};

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript missing' });
  }

  // If fireworksKey is set in Vercel env, execute real Fireworks AI API call
  if (fireworksKey) {
    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${fireworksKey}`
        },
        body: JSON.stringify({
          model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
          temperature: 0.1,
          messages: [
            {
              role: 'system',
              content: `You are Scalar Agent, a voice transaction parser. Parse the transcript into JSON with fields: rawItemName, quantity, claimedUnitPrice, currency ("USD"). Catalog: ${JSON.stringify(catalogItems || [])}`
            },
            { role: 'user', content: transcript }
          ]
        })
      });

      const data = await response.json();
      const contentStr = data.choices?.[0]?.message?.content || '{}';
      
      let parsed = {};
      try {
        const jsonMatch = contentStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        parsed = { rawItemName: transcript, quantity: 1, claimedUnitPrice: 5, currency: 'USD' };
      }

      return res.status(200).json({
        success: true,
        transcript,
        parsed,
        source: 'FIREWORKS_SERVERLESS'
      });
    } catch (err) {
      console.error('Fireworks serverless error:', err);
    }
  }

  // Smart fallback parser if env key is pending setup on Vercel
  const words = transcript.toLowerCase();
  let qty = 1;
  const qtyMatch = words.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\b/);
  if (qtyMatch) {
    const numMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
    qty = numMap[qtyMatch[1]] || parseInt(qtyMatch[1]) || 1;
  }

  let price = 5.0;
  const priceMatch = words.match(/(\$\d+|\d+\s*dollar|\d+\s*dollars)/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(/[^0-9.]/g, '')) || 5.0;
  }

  let itemName = transcript;
  if (words.includes('croissant')) itemName = 'Artisan Croissant';
  else if (words.includes('latte') || words.includes('coffee')) itemName = 'Oat Milk Latte';
  else if (words.includes('beans') || words.includes('espresso')) itemName = 'Organic Espresso Beans (12oz)';
  else if (words.includes('toast') || words.includes('avocado')) itemName = 'Avocado Toast';

  return res.status(200).json({
    success: true,
    transcript,
    parsed: {
      rawItemName: itemName,
      quantity: qty,
      claimedUnitPrice: price / qty,
      totalAmount: price,
      currency: 'USD'
    },
    source: 'SMART_FALLBACK'
  });
}
