# app/

> L2 | 父级: ../README.md

成员清单
(root)/: `/` noindex 语言检测页及英文文档布局
[locale]/: 六语言静态详情页、SEO metadata 与对应 lang 文档布局
shell.tsx: DocumentShell 文档外壳单一真相源，统一字体声明与 body 基础样式
globals.css: Tailwind CSS 4 入口、design tokens、主题映射和共享组件类

路由约束
根路径只做浏览器跳转；模型内容只存在于 `[locale]`。两套根布局共同复用 shell.tsx 加载同一 globals.css。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
