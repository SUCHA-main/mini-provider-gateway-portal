# Integration Guide

## OpenAI SDK Compatible

This gateway supports the OpenAI SDK's basic non-streaming chat-completions flow. Change the base URL and API key, and keep requests within the supported subset.

### Environment Variables

```bash
OPENAI_BASE_URL=http://localhost:3100/v1
OPENAI_API_KEY=<your_consumer_key>
OPENAI_MODEL=qwen2.5:3b
```

### JavaScript / Node.js

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:3100/v1',
  apiKey: 'mpg_your_consumer_key',
});

const res = await client.chat.completions.create({
  model: 'qwen2.5:3b',
  messages: [{ role: 'user', content: 'hello' }],
});
console.log(res.choices[0].message.content);
```

### Python

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3100/v1",
    api_key="mpg_your_consumer_key",
)

res = client.chat.completions.create(
    model="qwen2.5:3b",
    messages=[{"role": "user", "content": "hello"}],
)
print(res.choices[0].message.content)
```

### curl

```bash
curl http://localhost:3100/v1/chat/completions \
  -H "Authorization: Bearer mpg_your_consumer_key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5:3b",
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

## ai-wechat-digest-mvp Integration

To use this gateway as the AI provider for ai-wechat-digest-mvp:

1. Create a consumer in this gateway and get the API key
2. Update ai-wechat-digest-mvp's environment variables:

```bash
# In ai-wechat-digest-mvp/.env
AI_PROVIDER=deepseek
AI_API_BASE_URL=http://localhost:3100/v1
AI_API_KEY=mpg_your_consumer_key
AI_MODEL=mimo-v2.5-pro
```

3. Do NOT modify ai-wechat-digest-mvp source code

## go-websocket-chatroom Integration

The current go-websocket-chatroom implementation calls Ollama's `/api/chat` shape directly. It cannot use this gateway's OpenAI-compatible endpoint through environment variables alone; a small adapter/code change would be required.

## labelhub-ai-mvp Integration

The current labelhub-ai-mvp uses a rule-driven Mock AI reviewer and does not implement an external provider client. Gateway integration is a future extension, not a configuration-only step.

## Custom Application

For any application that supports OpenAI-compatible API:

1. Create a consumer in the gateway admin UI
2. Copy the consumer key (shown only once)
3. Configure your application:
   - Base URL: `http://localhost:3100/v1`
   - API Key: Your consumer key
   - Model: Any model available in your configured providers

## Notes

- Consumer keys start with `mpg_` prefix
- Each application should have its own consumer key for tracking
- Check the Logs panel in admin UI to monitor usage
- If a provider is down, check provider health in the Providers panel
- Supported request fields are `model`, `messages`, `temperature`, and `max_tokens`
- Streaming, tools/function calling, embeddings, retries/fallback, and the rest of the OpenAI API surface are not implemented
