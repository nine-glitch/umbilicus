export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: cors(),
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: cors() });
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1000,
        system: body.system,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', data);
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...cors() },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors() },
    });

  } catch (err) {
    console.error('Proxy error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors() },
    });
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
