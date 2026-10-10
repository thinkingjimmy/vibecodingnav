# VibeCodingNav

按场景选模型和框架。Next.js 16.2.10 + React 19.2.7 + TypeScript 6 + Tailwind CSS 4 + Base UI + Phosphor Icons + Vitest + Playwright，静态导出到 `out/`。站点域名 `vibecodingnav.com`。

<directory>
docs/ - 开发状态（CURRENT.md）与历史归档（archive/）
public/ - favicon、RSS
src/ - App Router、页面视图、组件、类型化内容与目录查询
tests/ - 内容校验、榜单挑选、过期判断与端到端流程
</directory>

<config>
AGENTS.md - 项目协作补充规范
CHANGELOG.md - 按日期记录已经落地的重大变化
components.json - Tailwind 入口与 Phosphor 图标约定
next.config.ts - `output: export`、目录式路由与 Turbopack 项目根
eslint.config.mjs - Next.js Core Web Vitals、TypeScript 规则与生成目录忽略清单
vitest.config.ts - Node 单测环境与 `@` 路径别名
playwright.config.ts - out/ 预览编排与 Chromium E2E
postcss.config.mjs - Tailwind CSS 4 PostCSS 管线
tsconfig.json - strict TypeScript 与 `@/*` 路径别名
package.json - pnpm 脚本、Node 版本与依赖真相源
pnpm-workspace.yaml - 明确不执行 sharp 与 unrs-resolver 的安装脚本
</config>

## 路由

英文在根路径，中文在 `/zh/`。场景、模型、工具、组合和基准都由内容 slug 生成静态页。

```text
src/content/*.ts
        │ validateContent
        ▼
   src/lib/catalog.ts
        │ 榜单、挑选、反向链接、90 天过期
        ▼
 src/views + src/app/(en) | (zh)/zh
```

## 开发与验收

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # out/ 纯静态产物
pnpm preview      # http://localhost:8080
pnpm check        # lint + typecheck + unit + build + e2e
```

## 文档约定

`docs/` 与 `tests/` 不使用 GEB 分形文档系统。其他目录维持文档同构；重大更新写入 `CHANGELOG.md`。

法则: 单一构建链路·类型先行·静态优先·文档同构
