# HTTP API

默认服务地址为 `http://localhost:3000`。HTTP 实现位于 `src/server.ts` 和 `src/server/routes`。这是本地单人接口，没有用户登录或多租户认证。

| 入口 | 用途 |
| --- | --- |
| `GET /health`、`GET /api/health` | 服务健康检查 |
| `POST /api/chat/stream` | SSE 对话：文本、思考、工具与完成事件 |
| `POST /api/chat` | 非流式对话 |
| `GET /api/chat/events/:id` | 已发出事件的重连回放 |
| `GET /api/sessions`、`POST /api/sessions` | 列出与创建会话 |
| `GET /api/sessions/:id` | 会话消息与状态 |
| `/api/workspaces` | 工作区创建、切换与管理 |
| `/api/workspace/*` | 文件树、读取、写入、预览与下载 |
| `/api/wiki/*` | Wiki 页面、统计、图谱与检索 |
| `/api/learner/*` | 学习者档案 |
| `/api/jobs` | 定时任务列表与管理 |
| `POST /api/jobs/:id/run` | 手动执行学习任务 |
| `GET /api/checkins/today` | 今日计划与完成状态 |
| `/api/skills`、`/api/skill-library` | 本地技能与远端内容库 |
| `/api/presets`、`/api/preset-library` | 内置及已配置远端模板 |
| `GET /api/settings` | 脱敏配置 |
| `PUT /api/settings/content-hub` | 保存用户自己的内容源 |
| `PUT /api/settings/permissions` | 切换权限模式 |
| `/api/terminal/sessions` | 实践终端会话 |
| `WS /api/terminal/sessions/:id/ws` | 终端数据流 |

跨会话操作可能返回 HTTP 409 与 `session_busy`，包含当前阻塞会话。客户端应显示阻塞原因，允许用户结束或处理中断中的任务，不应绕过队列直接切换运行状态。

涉及文件路径的接口使用工作区相对路径；禁止目录穿越。具体字段与错误格式以对应路由中的验证逻辑及测试为准。
