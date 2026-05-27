# Mini Provider Gateway Portal

个人 AI Provider Gateway 门户，用于统一管理和代理 Ollama / DeepSeek / MiMo / OpenAI-compatible Provider。

## 项目定位

这不是一个普通的聊天壳子，而是一个**个人 AI 网关层**：

- 统一管理 Provider（Ollama、OpenAI-compatible）
- 统一管理 Consumer App 和 Consumer Key
- 统一代理 `/v1/chat/completions`，兼容 OpenAI SDK
- 记录调用日志、延迟、Token 用量、失败原因
- 为 ai-wechat-digest-mvp、go-websocket-chatroom、labelhub-ai-mvp 等项目提供统一接入点

## 适用场景

- 本地运行 Ollama，想给多个项目提供统一入口
- 使用 MiMo / DeepSeek 等云端 API，想集中管理 Key
- 需要记录哪个项目调用了哪个模型、用量多少
- 想用 OpenAI SDK 直接对接各种 Provider

## 快速开始

```bash
# 克隆并安装
cd mini-provider-gateway-portal
npm install
npm run install:all

# 配置
cp .env.example .env
# 编辑 .env，设置 ADMIN_TOKEN

# 启动
npm run dev
```

- 后端: http://localhost:3100
- 前端: http://localhost:5176

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

MIT
