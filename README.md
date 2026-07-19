# AIEvalIndex - AI 模型跑分与真实评价汇总站

Next.js 16.2.10 + React 19.2.7 + TypeScript 6 + Tailwind CSS 4 + shadcn Base UI + Phosphor Icons + Vitest + Playwright，纯静态导出六语言模型详情页，Vercel 零配置部署。

<directory>
docs/ - 开发状态（CURRENT.md）与历史归档（archive/）
public/ - 站点静态资产（AIEvalIndex 汇聚棱镜标记 + Moonshot 模型厂商标记）
src/ - App Router、组件、类型化内容与领域工具（4 模块: app/components/content/lib）
tests/ - 语言策略单测、端到端流程与当前批准的视觉基线
</directory>

<config>
AGENTS.md - 项目协作补充规范，声明文档豁免、Changelog 要求、UI 验证与图标工具边界
CHANGELOG.md - 按日期记录已经落地的重大变化
components.json - 固定 base-nova、Tailwind 入口与 shadcn 组件生成别名
next.config.ts - `output: export`、目录式路由与 Turbopack 项目根
eslint.config.mjs - Next.js Core Web Vitals、TypeScript 规则与生成目录忽略清单
vitest.config.ts - Node 单测环境与 `@` 路径别名
playwright.config.ts - out/ 预览编排、Chromium E2E 与视觉基线路径
postcss.config.mjs - Tailwind CSS 4 PostCSS 管线
tsconfig.json - strict TypeScript 与 `@/*` 路径别名
package.json - pnpm 脚本、Node 版本与依赖真相源
</config>

## 路由与数据流

`/` 在浏览器端按 `localStorage.lang → navigator.languages → en` 跳转；`/[locale]/` 由 `generateStaticParams` 生成 en、zh-CN、ja、ko、es、fr 六份静态页面。

```text
src/content/models + src/content/i18n
                 │ satisfies 类型契约
                 ▼
             src/lib
                 │ Server Components
                 ▼
src/app/[locale] → out/{locale}/index.html
```

## 开发与验收

```bash
pnpm install
pnpm dev          # http://localhost:3000 · Next.js + Turbopack
pnpm build        # out/ 纯静态产物
pnpm preview      # http://localhost:8080 · 预览 out/
pnpm check        # lint + typecheck + unit + build + e2e/visual
```

## 文档约定

`docs/` 与 `tests/` 不使用 GEB 分形文档系统，目录内文件无需 L1/L2/L3 契约或 `[PROTOCOL]` 标记。其他目录维持既有文档同构规则；重大更新必须同步记录到 `CHANGELOG.md`。完整协作规范见 `AGENTS.md`。

法则: 单一构建链路·类型先行·静态优先·文档同构
