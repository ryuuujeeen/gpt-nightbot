export default async function handler(req, res) {
  const query = req.query.q || 'Hello!';
  const apiKey = process.env.OPENAI_API_KEY;

  const body = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: query }
    ],
    max_tokens: 100,
    temperature: 0.7
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const json = await response.json();
  const reply = json.choices?.[0]?.message?.content?.trim() || 'No response.';
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(reply);
}
