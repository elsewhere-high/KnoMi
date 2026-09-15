# KnoMi CLI 与服务

这个工作区提供 `knomi` 命令和 HTTP 服务，版本 0.1.0。

在仓库根目录安装依赖并构建后，`npm start -- --help` 显示命令行帮助，`npm run server -- --home ./runtime --workspace ./workspace` 启动 Web 服务。模型配置使用根目录的安全示例。

此包包含编译后的 CLI/服务、Web 界面、内置预设、文档转换器与 AGPL-3.0-only LICENSE。它是应用程序，不提供公共 JavaScript 库入口。

源码外安装验证：在本工作区运行 `npm pack`，然后在另一个临时目录安装该压缩包并运行 `knomi --help`、`knomi --version`。不要全局安装来替代隔离的产物检查。

Python 功能要求 Conda。源码外安装时设置 `CONDA_PREFIX` 或 `KNOMI_PYTHON`，不会自动调用本机系统 Python。
