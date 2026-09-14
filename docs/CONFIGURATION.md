# 配置与安全边界

默认数据位置为 `~/.knomi`。推荐用 `./run.sh` 将配置、数据和工作区集中在项目的 `runtime` 与 `workspace` 目录中，便于备份和清理。

| 参数 | 环境变量 | 用途 |
| --- | --- | --- |
| `--home` | `KNOMI_HOME` | 配置与学习数据根目录 |
| `--config` | `KNOMI_CONFIG_FILE` | 配置 JSON 文件 |
| `--config-dir` | `KNOMI_CONFIG_DIR` | 配置目录 |
| `--data` / `--data-dir` | `KNOMI_DATA_DIR` | 学习数据与会话 |
| `--skills` / `--skills-dir` | `KNOMI_SKILLS_DIR` | 本地技能 |
| `--workspace` | `KNOMI_WORKSPACE_DIR` | 文件与终端工作区 |
| `--port` | `KNOMI_PORT` | HTTP 端口，默认 3000 |

模型提供方放在 `providers` 中，每个条目包含 `baseUrl`、`api`、`apiKey` 和 `models`。支持 `openai-completions` 与 `anthropic-messages` 协议。通过设置界面保存配置时，密钥读取结果会脱敏；运行文件仍可能保存明文密钥，应保持私有。

内容库默认未配置，不连接远端。内置模板始终可用。配置 `contentHub.type: github` 时填写自己的 `owner`、`repo`、`ref`；使用 `bundle` 时填写自己的 `baseUrl`。`token` 为所选服务的可选凭据。`scripts/content-hub-server` 提供本地服务和合成样例。

Feishu、WeChat、QQ、OCR、联网搜索和 MCP 按需配置。渠道默认关闭，桥接渠道需要用户设置自己的共享令牌。不要把空示例令牌用于已启用的桥接服务。

## 权限与沙箱

权限层与操作系统沙箱分别生效：

- 默认模式对需要批准的操作显示审批卡；无人应答、超时、取消和无界面调用会拒绝该操作。
- 自动审批和完全权限模式仍保留破坏性命令、SSH 密钥等敏感路径的拒绝规则。
- `npm run server:sandbox` 启用系统沙箱。macOS 使用系统沙箱，Linux 需要 bubblewrap、socat 和 ripgrep。权限批准不会越过沙箱限制。
- 终端子进程会剔除明显的 API key、token 和 password 环境变量。工作区文件接口检查目录边界和符号链接。

保持 `permission-system-config.ts` 的拒绝规则、`permission-bridge.ts` 的会话绑定，以及路径校验逻辑。不要通过放宽安全规则修复 UI 问题。

日志默认记录请求元数据。仅在确有需要时设置 `LOG_LLM_BODY=1`；它会将提示词和模型输出写入本地日志。运行目录已加入忽略规则。
