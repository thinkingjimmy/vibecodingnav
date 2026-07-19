# 当前开发基线

> 更新日期：2026-07-19
> 状态：Kimi K3 已迁入可扩展模型 slug 路由，Header 模型目录与六语言静态 URL 已完成。

## 当前能力

- Next.js App Router 生成 `/` noindex 占位、英文 `/models/kimi-k3/` 与五个 `/{locale}/models/kimi-k3/` 静态详情页。
- 模型注册表以 slug 统一内容查询、静态参数和导航路径；默认英文 URL 无前缀，其他语言使用独立 locale 子路径。
- 模型、Header 目录与字典均为类型化 TypeScript 内容模块，`satisfies` 在构建期验证数据契约。
- 页面默认使用 Server Components；客户端代码只负责跑分筛选、Header 模型菜单和语言菜单。
- Header Models 菜单按 OpenAI / Anthropic / Moonshot / Google 分组展示官方 logo、分数与可用状态；当前只开放 Kimi K3。
- Metadata API 输出本地化 title、description、canonical、hreflang 与 x-default。
- Tailwind CSS 4 保持原有暖纸底、三字体、发丝线和低饱和蓝设计系统。
- `output: export` 输出 `out/`，Vercel 按 Next.js 项目零配置部署。

## 数据流

```text
src/content/models/{catalog,kimi-k3}.ts + src/content/i18n/*.ts
                                  │
                                  ▼
                  src/lib 模型注册表/路径/兜底层
                                  │
                                  ▼
                      src/app/model-detail.tsx
                         ┌────────┴────────┐
                         ▼                 ▼
       out/models/kimi-k3/    out/{locale}/models/kimi-k3/
```

## 本地验证

```bash
pnpm dev          # Next.js + Turbopack · http://localhost:3000
pnpm build        # 生成 out/
pnpm preview      # 静态预览 · http://localhost:8080
pnpm check        # lint + typecheck + unit + build + e2e/visual
```

自动化验收包含 5 项语言/模型/兜底单测、36 项 Chromium E2E，以及英文/中文桌面、移动端、语言菜单和模型菜单七张视觉金本。

## 当前边界

- 只有 Kimi K3 模型详情页；Header 已展示后续模型目录，但未收录模型保持不可用且不生成路由。
- 数据是 2026-07-17 人工快照；没有后端、数据库、ISR 或自动采集。
- 根路径只是临时 noindex 占位，不是正式 Home，也不提供本地化版本。
- ja、ko、es、fr 仍以 AI 翻译为主，英文是最终兜底。
- canonical 域名固定为 `https://aievalindex.vercel.app`，生产部署尚未验收。

## 下一步

1. 连接 Vercel 并验证根占位、六个模型 URL、静态资源、canonical 与 hreflang。
2. 完成 zh-CN 内容终校并抽查其他语言术语。
3. 新增模型时先注册 slug 与详情数据，再开放 Header 对应项，不在共享详情页堆模型分支。
