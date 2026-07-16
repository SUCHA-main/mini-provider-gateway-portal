# Mini Provider Gateway Portal

个人 AI Provider Gateway 门户，用于统一管理和代理 Ollama / DeepSeek / MiMo / OpenAI-compatible Provider。

## 项目定位

这不是一个普通的聊天壳子，而是一个**个人 AI 网关层**：

- 统一管理 Provider（Ollama、OpenAI-compatible）
- 统一管理 Consumer App 和 Consumer Key
- 统一代理 `/v1/chat/completions` 的基础非流式子集，可通过 OpenAI SDK 调用
- 记录调用日志、延迟、Token 用量、失败原因
- 为支持 OpenAI-compatible Chat Completions 的个人应用提供统一接入点

## 适用场景

- 本地运行 Ollama，想给多个项目提供统一入口
- 使用 MiMo / DeepSeek 等云端 API，想集中管理 Key
- 需要记录哪个项目调用了哪个模型、用量多少
- 想用 OpenAI SDK 直接对接各种 Provider

## 快速开始

```bash
# 克隆并安装
cd mini-provider-gateway-portal
npm ci
npm run install:all

# 配置
cp .env.example .env
# 编辑 .env，设置 ADMIN_TOKEN

# 启动
npm run dev
```

- 后端: http://localhost:3100
- 前端: http://localhost:5176

### Docker

```bash
cp .env.example .env
# 使用前替换 ADMIN_TOKEN 占位值
docker compose up --build
```

容器会在 `http://localhost:3100` 同时提供管理界面和 API。Compose 将 SQLite 数据保存到本地 `data/` 目录。

## 端口说明

| 服务 | 端口 |
|------|------|
| Backend API | 3100 |
| Frontend Dev | 5176 |

## Provider 类型

| 类型 | 说明 |
|------|------|
| `openai_compatible` | MiMo、DeepSeek、OpenAI 或任何兼容 OpenAI API 的 Provider |
| `ollama` | 本地 Ollama 实例 |

## 安全要求

1. **不要**把真实 API Key 写进代码、README、测试文件或提交历史
2. `.env` 和 `data/*.db` 必须加入 `.gitignore`
3. 前端只显示 masked 形式的 Key（如 `sk-****abcd`）
4. 后端日志不记录 request body、messages 内容、API Key
5. Consumer Key 只在创建/轮换时返回明文一次，数据库只保存 hash
6. Provider API Key 因上游调用需要，会以明文保存在本地 SQLite，但管理 API 只返回 masked 值
7. 管理接口会校验 `x-admin-token`；前端将 token 保存在 `localStorage`，仅适合个人本地 MVP
8. 数据库中的限流字段当前未执行，不应宣称已有实际限流

## 兼容范围

当前只支持基础的非流式 Chat Completions，请求字段包括 `model`、`messages`、`temperature` 和 `max_tokens`。暂不支持 streaming、tools/function calling、embeddings、计费、自动重试/故障切换、高可用或完整 OpenAI API。

## 接入方式

```bash
# 使用 curl
curl http://localhost:3100/v1/chat/completions \
  -H "Authorization: Bearer mpg_YOUR_CONSUMER_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"qwen2.5:3b","messages":[{"role":"user","content":"你好"}]}'

# 环境变量方式
OPENAI_BASE_URL=http://localhost:3100/v1
OPENAI_API_KEY=mpg_YOUR_CONSUMER_KEY
OPENAI_MODEL=qwen2.5:3b
```

## 项目截图

| Dashboard | Providers | Logs |
|-----------|-----------|------|
| ![Dashboard](docs/images/dashboard.png) | ![Providers](docs/images/providers.png) | ![Logs](docs/images/logs.png) |

## 详细文档

- [架构说明](docs/ARCHITECTURE.md)
- [API 文档](docs/API.md)
- [接入指南](docs/INTEGRATION.md)
- [开发路线](docs/ROADMAP.md)

## 许可证

[MIT](LICENSE)
