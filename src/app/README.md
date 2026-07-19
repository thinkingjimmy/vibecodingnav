# app/

> L2 | 父级: ../README.md

成员清单
(root)/: `/` noindex 占位页、默认英文模型路由及英文文档布局
[locale]/: 五种非默认语言模型路由与对应 lang 文档布局
model-detail.tsx: 默认英文/本地化动态路由共享的模型详情组装与 SEO metadata 内核
shell.tsx: DocumentShell 文档外壳单一真相源，统一字体声明与 body 基础样式
globals.css: Tailwind CSS 4 入口、design tokens、主题映射和共享组件类（含紧凑指标卡语义、跑分表吸顶底线、Kimi 数据带与社区评价绿/米灰/红情绪色）

路由约束
根路径只承载 noindex 占位；英文模型使用 `/models/{slug}/`，其他语言使用 `/{locale}/models/{slug}/`。两套根布局共同复用 shell.tsx 加载同一 globals.css。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
