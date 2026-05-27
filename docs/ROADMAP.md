# Roadmap

## v0.1 MVP (Current)

- [x] Provider CRUD (create, read, update, delete)
- [x] Provider types: OpenAI-compatible, Ollama
- [x] Consumer key management with hash storage
- [x] Consumer key rotation
- [x] Proxy `/v1/chat/completions` endpoint
- [x] Call logging (latency, tokens, errors)
- [x] Admin dashboard (providers, consumers, logs)
- [x] Integration snippet generator
- [x] Health check endpoint
- [x] Docker support (basic)

## v0.2

- [ ] Streaming support (`stream: true`)
- [ ] Provider fallback (try next provider on failure)
- [ ] Rate limiting enforcement
- [ ] Usage summary dashboard
- [ ] Integration with ai-wechat-digest-mvp
- [ ] Integration with go-websocket-chatroom
- [ ] Provider health auto-check
- [ ] Export logs to CSV

## v0.3

- [ ] Docker Compose polish (multi-stage build)
- [ ] GitHub Actions CI/CD
- [ ] Provider health dashboard
- [ ] Request/response size metrics
- [ ] Consumer usage breakdown
- [ ] Model alias mapping
- [ ] Batch API support
- [ ] Webhook notifications for errors

## Future Ideas

- [ ] WebSocket support
- [ ] Prompt templates
- [ ] Cost estimation
- [ ] Multi-user support (simple)
- [ ] API key scoping per model
- [ ] Request replay for debugging
