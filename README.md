# Mini Provider Gateway Portal

A personal AI Provider Gateway for managing and proxying requests to Ollama, DeepSeek, MiMo, and OpenAI-compatible providers.

## Features

- **Provider Registry**: Manage multiple AI providers (Ollama, OpenAI-compatible)
- **Consumer Key Management**: Generate and manage API keys for your applications
- **Unified Proxy**: Basic non-streaming `/v1/chat/completions` subset usable with the OpenAI SDK
- **Call Logging**: Track request latency, token usage, and errors
- **Admin Dashboard**: Web UI for managing providers, consumers, and viewing logs

## Quick Start

```bash
# Clone and install
cd mini-provider-gateway-portal
npm ci
npm run install:all

# Configure
cp .env.example .env
# Edit .env and set ADMIN_TOKEN

# Run
npm run dev
```

- Backend: http://localhost:3100
- Frontend: http://localhost:5176

### Docker

```bash
cp .env.example .env
# Replace the ADMIN_TOKEN placeholder before use
docker compose up --build
```

The container serves both the portal UI and API at `http://localhost:3100`. SQLite data is stored in the local `data/` directory through the Compose volume.

## Provider Types

| Type | Description |
|------|-------------|
| `openai_compatible` | MiMo, DeepSeek, OpenAI, any provider with OpenAI-compatible API |
| `ollama` | Local Ollama instances |

## Consumer Keys

Consumer keys are used by your applications to authenticate with the gateway. Keys are shown only once upon creation or rotation; only their SHA-256 hashes and short prefixes are stored.

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
- Replace the example `ADMIN_TOKEN`; provider, consumer, and log management routes require `x-admin-token`
- Consumer keys are random, stored as SHA-256 hashes, and compared with a timing-safe check
- Provider API keys are stored in plaintext in the local SQLite database because they are needed for upstream calls; admin API responses only return a masked form
- Call logs contain metadata, token counts, latency, status, and sanitized error summaries, not request/response message bodies
- The portal stores the admin token in browser `localStorage`; use it only as a personal local MVP, not as a hardened multi-user admin system
- Rate-limit fields exist in the schema but are not enforced

## Compatibility Scope

The proxy supports basic non-streaming chat completions with `model`, `messages`, `temperature`, and `max_tokens`. It does not implement streaming, tools/function calling, embeddings, billing, retries/fallback, high availability, or the full OpenAI API surface.

## Screenshots

| Dashboard | Providers | Logs |
|-----------|-----------|------|
| ![Dashboard](docs/images/dashboard.png) | ![Providers](docs/images/providers.png) | ![Logs](docs/images/logs.png) |

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for planned features.

## License

[MIT](LICENSE)
