export async function callOllama(provider, body) {
  const url = `${provider.base_url}/api/chat`;

  const payload = {
    model: body.model || provider.default_model,
    messages: body.messages,
    stream: false,
  };
  if (body.temperature !== undefined) {
    payload.options = { temperature: body.temperature };
  }

  const timeout = provider.timeout_ms || 60000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!resp.ok) {
      throw new Error(`Ollama returned HTTP ${resp.status}`);
    }

    const ollamaResult = await resp.json();
    return convertToOpenAiFormat(ollamaResult, body.model || provider.default_model);
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function convertToOpenAiFormat(ollamaResult, model) {
  const content = ollamaResult.message?.content || '';
  return {
    id: `chatcmpl-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: ollamaResult.prompt_eval_count || null,
      completion_tokens: ollamaResult.eval_count || null,
      total_tokens: (ollamaResult.prompt_eval_count && ollamaResult.eval_count)
        ? ollamaResult.prompt_eval_count + ollamaResult.eval_count
        : null,
    },
  };
}
