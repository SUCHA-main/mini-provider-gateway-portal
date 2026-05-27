# Mini Provider Gateway Portal

A personal AI Provider Gateway for managing and proxying requests to Ollama, DeepSeek, MiMo, and OpenAI-compatible providers.

## Features

- **Provider Registry**: Manage multiple AI providers (Ollama, OpenAI-compatible)
- **Consumer Key Management**: Generate and manage API keys for your applications
- **Unified Proxy**: Single `/v1/chat/completions` endpoint compatible with OpenAI SDK
- **Call Logging**: Track request latency, token usage, and errors
- **Admin Dashboard**: Web UI for managing providers, consumers, and viewing logs

## Quick Start

```bash
# Clone and install
cd mini-provider-gateway-portal
npm install
npm run install:all

# Configure
cp .env.example .env
# Edit .env and set ADMIN_TOKEN

# Run
npm run dev
```

- Backend: http://localhost:3100
- Frontend: http://localhost:5176

## Provider Types

| Type | Description |
|------|-------------|
| `openai_compatible` | MiMo, DeepSeek, OpenAI, any provider with OpenAI-compatible API |
| `ollama` | Local Ollama instances |

## Consumer Keys

Consumer keys are used by your applications to authenticate with the gateway. Keys are shown only once upon creation - store them securely.

```
mpg_a1b2c3d4e5f6...
```

## API Examples

```bash
# Health check
curl http://localhost:3100/api/health

# Create provider (requires admin token)
curl -X POST http://localhost:3100/api/providers \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Ollama","type":"ollama","base_url":"http://127.0.0.1:11434","default_model":"qwen2.5:3b"}'

# Call with consumer key
curl http://localhost:3100/v1/chat/completions \
  -H "Authorization: Bearer mpg_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:3b","messages":[{"role":"user","content":"hello"}]}'
```

## Security Notes

- Never commit `.env` files or database files
- Consumer keys are hashed in storage
- Provider API keys are never returned to the frontend in plaintext
- Call logs do not contain message content

## Screenshots

<!-- TODO: Add screenshots -->

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for planned features.

## License

MIT
