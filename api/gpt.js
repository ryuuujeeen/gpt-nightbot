export default async function handler(req, res) {
  try {
    // Get the query from the request, default to 'Hello!' if not provided
    const query = req.query.q || 'Hello!';
    
    // Get the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found in environment variables' });
    }

    // Construct the body for the OpenAI API request
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: query }],
      max_tokens: 100,
      temperature: 0.7
    };

    // Send the request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    // If the response is not okay, throw an error
    if (!response.ok) {
      throw new Error('Failed to fetch response from OpenAI');
    }

    // Parse the response from OpenAI
    const json = await response.json();

    // Get the reply from the OpenAI response
    const reply = json.choices?.[0]?.message?.content?.trim() || 'No response from OpenAI.';

    // Send the response back to the client
    res.status(200).send(reply);
  } catch (error) {
    // Catch any errors and respond with an error message
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
