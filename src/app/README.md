# app/

> L2 | 父级: ../README.md

成员清单
(en)/: 英文根布局、首页、场景、模型、工具箱、条目、组合、基准、更新日志、sitemap 与 robots
(zh)/: 中文根布局；页面在 zh/ 下，URL 为 `/zh/...`
shell.tsx: DocumentShell，Geist 字体、主题启动脚本、生产环境 GA4 与 html/body
globals.css: Tailwind CSS 4 入口、zinc 语义色、共享排版类，以及只在键盘 Tab 时出现的细焦点环

路由约束
英文不带语言前缀。中文全部在 `/zh/`。两套根布局共用 shell.tsx。动态路由 `dynamicParams = false`，只生成内容里存在的 slug。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
