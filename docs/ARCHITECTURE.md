# Architecture

## System Positioning

Mini Provider Gateway Portal is a personal AI Provider Gateway that sits between your applications (consumers) and AI providers. It provides:

- Basic non-streaming OpenAI-compatible chat-completions endpoint
- Provider management and health monitoring
- Consumer key authentication
- Call logging and analytics

## Architecture Diagram

```mermaid
flowchart LR
    A[Admin UI] --> API[Backend API]
    C[Consumer Apps] --> P[/v1/chat/completions]
    P --> AUTH[Consumer Key Auth]
    AUTH --> REG[Provider Registry]
    REG --> O[Ollama Adapter]
    REG --> OA[OpenAI-compatible Adapter]
    O --> OL[Ollama]
    OA --> EXT[MiMo / DeepSeek / OpenAI-compatible]
    P --> LOG[(Call Logs)]
    API --> DB[(SQLite)]
```

## Request Flow

1. Consumer app sends request to `/v1/chat/completions` with consumer key
2. Middleware validates consumer key (hash comparison)
3. Router selects provider (explicit ID or first enabled)
4. Adapter formats request for provider type (Ollama or OpenAI-compatible)
5. Response is returned to consumer
6. Request metadata is logged to database

## Provider Registry

Providers are stored in SQLite with:
- `type`: Determines which adapter to use
- `base_url`: Provider API endpoint
- `api_key`: Stored in plaintext in local SQLite for upstream calls; admin API responses expose only a masked form
- `enabled`: Toggle providers without deletion

## Consumer Key Auth

1. Consumer keys are generated with `mpg_` prefix + 48 hex chars
2. Only SHA-256 hash is stored in database
3. On each request, hash is compared using timing-safe comparison
4. Key prefix (first 7 chars) stored for identification

## Proxy Flow

### OpenAI-compatible Adapter

- If `base_url` ends with `/v1` → request `${base_url}/chat/completions`
- If `base_url` doesn't end with `/v1` → request `${base_url}/v1/chat/completions`
- Sends `Authorization: Bearer <provider_api_key>`
- Forces `stream: false`

### Ollama Adapter

- Requests `${base_url}/api/chat`
- Converts Ollama response to OpenAI-compatible format
- Maps `eval_count` / `prompt_eval_count` to usage tokens

## Log Flow

Each proxy request logs:
- `request_id`: UUID for tracing
- `consumer_id`, `provider_id`: References
- `model`, `route`, `status`, `http_status`
- `latency_ms`: Round-trip time
- `input_tokens`, `output_tokens`, `total_tokens`: From response usage
- `error_message`: Sanitized status/network summary on failure; provider response bodies are not stored

## Database Schema

### providers
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Display name |
| type | TEXT | `openai_compatible` or `ollama` |
| base_url | TEXT | API endpoint |
| api_key | TEXT | Provider API key (local only) |
| default_model | TEXT | Default model name |
| enabled | INTEGER | 1 = enabled, 0 = disabled |
| timeout_ms | INTEGER | Request timeout |

### consumers
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Display name |
| key_hash | TEXT | SHA-256 hash of consumer key |
| key_prefix | TEXT | First 7 chars for identification |
| enabled | INTEGER | 1 = enabled |
| allowed_provider_ids | TEXT | JSON array or null for all |
| rate_limit_per_min | INTEGER | Rate limit (not enforced yet) |

### call_logs
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| request_id | TEXT | UUID for tracing |
| consumer_id | INTEGER | Consumer reference |
| provider_id | INTEGER | Provider reference |
| model | TEXT | Model used |
| status | TEXT | `success` or `error` |
| latency_ms | INTEGER | Request duration |
| error_message | TEXT | Error details |

## What v0.1 Does NOT Do

- No streaming support
- No provider fallback/retry
- No rate limiting enforcement
- No billing or usage tracking
- No multi-tenant support
- No plugin system
- No WebSocket support
