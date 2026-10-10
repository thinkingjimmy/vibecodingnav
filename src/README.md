# src/

> L2 | 父级: ../README.md

成员清单
app/: Next.js App Router。英文根布局在 `(en)`，中文根布局在 `(zh)`，页面在 `(zh)/zh`
components/: 页头、页脚、榜单、分类筛选、复制块与厂商标记
content/: 类型化场景、模型、基准、成绩、工具与组合
lib/: 契约、语言路径、站点常量、字典与目录查询
views/: 各路由的页面组装，不含 URL

依赖方向
content → lib/contracts；lib/catalog → content；views → lib 与 components；app → views。禁止 content 反向依赖 UI。

法则: 服务端默认·客户端叶子·依赖单向·类型闭环

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
