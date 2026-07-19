# src/

> L2 | 父级: ../README.md

成员清单
app/: Next.js App Router，负责根占位、默认/本地化动态模型路由、Metadata 与全局样式
components/: 页面区块、三个最小客户端交互叶子与 shadcn Base UI primitives
content/: 类型化模型详情、Header 模型目录和六语言 UI 字典
lib/: 领域契约、语言决策、模型注册表与站点路径常量

依赖方向
content → lib/contracts；app/components → lib；app → components。禁止 content 反向依赖 UI。

法则: 服务端默认·客户端叶子·依赖单向·类型闭环

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
