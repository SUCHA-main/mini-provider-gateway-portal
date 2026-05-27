# AGENTS.md - AI Coding Guide

This file provides guidance for AI coding tools working on this project.

## Project Goal

Mini Provider Gateway Portal is a personal AI Provider Gateway that:
- Manages multiple AI providers (Ollama, OpenAI-compatible)
- Generates and manages consumer API keys
- Proxies `/v1/chat/completions` requests to providers
- Logs call latency, token usage, and errors

## Directory Structure

```
mini-provider-gateway-portal/
  backend/          # Express API server
    src/
      server.js     # Entry point
      db.js         # SQLite database setup
      config.js     # Environment configuration
      middleware/   # Auth and error handling
      routes/       # API routes
      services/     # Business logic
      providers/    # Provider adapters (ollama, openai-compatible)
      utils/        # Crypto, masking, request ID
    test/           # Tests using node:test
    data/           # SQLite database (gitignored)
  frontend/         # React + Vite admin UI
    src/
      components/   # React components
      api.js        # API client
  docs/             # Documentation
```

## Run Commands

```bash
npm run install:all   # Install all dependencies
npm run dev           # Start both backend and frontend
npm run dev:backend   # Start backend only
npm run dev:frontend  # Start frontend only
npm test              # Run backend tests
npm run check         # Syntax check backend
```

## Development Constraints

1. **No TypeScript** - Use plain JavaScript with clear naming
2. **No complex UI framework** - Use React with native CSS
3. **No streaming** - First version forces `stream: false`
4. **No billing/multi-tenant** - Keep it personal and simple
5. **No plugin system** - Direct provider adapters only

## Security Rules

- NEVER write real API keys in code, tests, logs, or commits
- NEVER log request body, messages content, or API keys
- NEVER return plaintext provider API keys to frontend
- Consumer keys: show plaintext only on creation/rotation, store only hash
- `.env` and `data/*.db` must be in `.gitignore`

## Other Repositories

- Do NOT modify ai-wechat-digest-mvp
- Do NOT modify go-websocket-chatroom
- Do NOT modify labelhub-ai-mvp
- Only write integration docs in `docs/INTEGRATION.md`

## Adding Features

Before implementing new features:
1. Update `docs/ARCHITECTURE.md` with the design
2. Update `docs/ROADMAP.md` if applicable
3. Keep changes minimal and focused

## Dependencies

- Backend: express, cors, dotenv (node:sqlite is built-in)
- Frontend: react, react-dom, vite
- Do not add complex libraries without necessity
