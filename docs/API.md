# API Reference

Base URL: `http://localhost:3100`

## Health Check

```bash
GET /api/health
```

Response:
```json
{
  "ok": true,
  "service": "mini-provider-gateway-portal",
  "time": "2024-01-01T00:00:00.000Z",
  "db": "ok"
}
```

## Admin Endpoints

All admin endpoints require `x-admin-token` header.

### Providers

```bash
# List providers
GET /api/providers

# Create provider
POST /api/providers
{
  "name": "My Ollama",
  "type": "ollama",
  "base_url": "http://127.0.0.1:11434",
  "default_model": "qwen2.5:3b",
  "enabled": true
}

# Update provider
PATCH /api/providers/:id
{
  "name": "Updated Name"
}

# Delete provider
DELETE /api/providers/:id

# Test provider
POST /api/providers/:id/test
```

### Consumers

```bash
# List consumers
GET /api/consumers

# Create consumer
POST /api/consumers
{
  "name": "my-app"
}

# Response includes api_key (shown only once)
{
  "consumer": { "id": 1, "name": "my-app", ... },
  "api_key": "mpg_a1b2c3d4..."
}

# Update consumer
PATCH /api/consumers/:id

# Delete consumer
DELETE /api/consumers/:id

# Rotate consumer key
POST /api/consumers/:id/rotate-key
```

### Logs

```bash
# List logs
GET /api/logs?limit=50&status=success&provider_id=1&consumer_id=1
```

## Proxy Endpoints

### Chat Completions

```bash
# OpenAI-compatible endpoint
POST /v1/chat/completions

# Alternative endpoint
POST /proxy/chat
```

Authentication: `Authorization: Bearer <consumer_key>` or `x-consumer-key: <consumer_key>`

Request:
```json
{
  "providerId": 1,
  "model": "qwen2.5:3b",
  "messages": [
    {"role": "user", "content": "hello"}
  ],
  "temperature": 0.7,
  "max_tokens": 512
}
```

Response (OpenAI-compatible):
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "qwen2.5:3b",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Hello!"},
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 5,
    "total_tokens": 15
  }
}
```

### Provider Selection

1. If `x-provider-id` header is set, use that provider
2. If `providerId` is in request body, use that provider
3. Otherwise, use first enabled provider
4. If no enabled provider found, return 400

## Error Response

```json
{
  "error": {
    "message": "Provider request failed",
    "type": "provider_error",
    "request_id": "uuid",
    "provider_id": 1,
    "detail": "Brief error description"
  }
}
```
