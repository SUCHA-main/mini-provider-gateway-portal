# Integration Guide

## OpenAI SDK Compatible

This gateway is fully compatible with OpenAI SDK. Just change the base URL and API key.

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
AI_PROVIDER=openai_compatible
OPENAI_BASE_URL=http://localhost:3100/v1
OPENAI_API_KEY=mpg_your_consumer_key
OPENAI_MODEL=mimo-v2.5-pro
```

3. Do NOT modify ai-wechat-digest-mvp source code

## go-websocket-chatroom Integration

For AI-powered chat features in go-websocket-chatroom:

```bash
# In go-websocket-chatroom/.env
AI_BASE_URL=http://localhost:3100/v1
AI_API_KEY=mpg_your_consumer_key
AI_MODEL=qwen2.5:3b
```

## labelhub-ai-mvp Integration

```bash
# In labelhub-ai-mvp/.env
OPENAI_BASE_URL=http://localhost:3100/v1
OPENAI_API_KEY=mpg_your_consumer_key
OPENAI_MODEL=qwen2.5:3b
```

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
