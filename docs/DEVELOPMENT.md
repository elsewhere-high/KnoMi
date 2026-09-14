# 开发与架构

KnoMi 使用 npm workspaces。`apps/knomi/src` 是 TypeScript 后端，编译输出到 `dist`；`apps/knomi/web` 是 React + Vite 界面；`apps/showcase` 是无模型调用的回放应用；`electron` 承载桌面窗口。

代理执行由 Pi SDK 提供。`src/agent/knomi-extension.ts` 注册工具和会话钩子，`system-prompt.ts` 定义教学行为。`pi-runner.ts` 为 HTTP 和渠道提供会话接口。保持单进程队列、取消语义与 409 `session_busy` 行为。

记忆分别存放在 `src/memory/learner`、`src/memory/l2`、`src/memory/l3`。L1 记录学习证据，L2 管理 Wiki 与检索，L3 使用 Node SQLite FTS5 索引历史会话。掌握度是启发式分数，不应解释为测量准确的概率。

运行目录统一由 `runtime.ts` 解析；优先级为命令行参数、`KNOMI_*` 环境变量、默认用户目录。新增路径逻辑应放在该模块。第三方 `PI_CODING_AGENT_*` 变量保持其既定含义。

前端新增组件使用 React，存储层采用 EventEmitter。业务网络调用经过 `web/src/api`。中文与英文资源应同步修改。品牌标记是 `BrandMark.tsx`，颜色由 `themes.css` 定义，图标原稿位于 `build/icon.svg`。

## 本地检查

激活 `.conda-env` 后执行：

```bash
npm test                 # Vitest，含 HTTP 子进程与 DOM 检查
npm run build           # 后端和前端类型检查、Web 构建
npm run showcase:build  # 回放应用类型检查和构建
npm run eval:l2-retrieval
```

没有额外的 ESLint 或 Prettier 门禁。修改源码后应运行对应检查；不要为通过检查删除测试或降低安全限制。

浏览器响应式回归脚本为 `scripts/mobile-layout-smoke.cjs`。它依赖外部 Playwright，使用独立测试配置与浏览器上下文，可通过 `PLAYWRIGHT_MODULE`、`MOBILE_TEST_URL` 和 `MOBILE_TEST_OUTPUT` 指定依赖、地址与结果目录。实际模型、OCR 和消息渠道仍需单独凭据验证。

Python 的项目环境由 `environment.yml` 定义。应用使用 `utils/python-runtime.ts` 选择 Conda Python，终端文件运行和 PowerPoint 预览共享这个选择。Python 脚本位于 `apps/knomi/scripts`，不要将 `__pycache__` 写入发布内容。
