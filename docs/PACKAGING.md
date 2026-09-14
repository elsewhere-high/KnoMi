# 桌面与容器

## Electron

激活 Conda 环境并完成 Web/后端构建后：

```bash
npm run electron
npm run electron:build
```

桌面应用名称为 KnoMi，应用标识为 `app.knomi.desktop`。macOS 图标使用 `build/icon.icns`，Windows/Linux 使用 `build/icon.png`。图标源文件为 `build/icon.svg`。

应用会启动自己的后端并等待健康检查，通过独立 `~/.knomi` 目录保存数据。首次配置不包含有效模型密钥；进入设置后配置个人模型服务。桌面环境中的 Python 文档预览仍需 Conda，通过 `KNOMI_PYTHON` 或已激活的 `CONDA_PREFIX` 指定。

`scripts/after-pack.cjs` 修正打包后 PTY helper 的执行权限，必须随打包流程保留。打包产物默认没有签名或公证配置；签名属于用户自己的分发配置。

Windows 构建入口为 `npm run electron:build:win`。跨系统目标需要在对应系统中验证，不能以 macOS 测试替代。

## Docker

Dockerfile 使用 Node.js 22 与隔离的 Conda Python，保留本地配置与工作区挂载。需要已启动的 Docker daemon。

```bash
mkdir -p runtime/config runtime/data runtime/skills workspace
cp config.example.json runtime/config/config.json
docker compose up --build
```

容器通过 3000 端口提供 Web 服务，配置和数据分别挂载到 `/etc/knomi`、`/var/lib/knomi`。先填入个人模型配置再进行真实模型对话。容器构建和桌面安装包需要分别验证，应用源码构建成功不代表所有分发目标已验证。
