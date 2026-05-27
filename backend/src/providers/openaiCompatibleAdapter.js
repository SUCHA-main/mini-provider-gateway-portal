export async function callProvider(provider, body) {
  let url = provider.base_url;
  if (url.endsWith('/v1')) {
    url = `${url}/chat/completions`;
  } else {
    url = `${url}/v1/chat/completions`;
  }

  const headers = { 'Content-Type': 'application/json' };
  if (provider.api_key) {
    headers['Authorization'] = `Bearer ${provider.api_key}`;
  }

  const payload = {
    model: body.model || provider.default_model,
    messages: body.messages,
    stream: false,
  };
  if (body.temperature !== undefined) payload.temperature = body.temperature;
  if (body.max_tokens !== undefined) payload.max_tokens = body.max_tokens;

  const timeout = provider.timeout_ms || 60000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Provider returned ${resp.status}: ${text.slice(0, 200)}`);
    }
    return await resp.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}
