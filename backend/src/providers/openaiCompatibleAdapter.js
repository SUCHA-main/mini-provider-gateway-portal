export async function callProvider(provider, body) {
  const url = buildProviderUrl(provider.base_url);

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
      throw new Error(`Provider returned HTTP ${resp.status}`);
    }
    return await resp.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export function buildProviderUrl(baseUrl) {
  const normalized = String(baseUrl || '').replace(/\/+$/, '');
  if (normalized.endsWith('/v1')) {
    return `${normalized}/chat/completions`;
  }
  return `${normalized}/v1/chat/completions`;
}
