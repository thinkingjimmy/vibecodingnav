# 当前开发基线

> 更新日期：2026-07-17  
> 状态：Kimi K3 六语言 MVP 已完成 Next.js 16 静态化重构，待生产部署验收。

## 当前能力

- Next.js App Router 生成 `/` 与 en、zh-CN、ja、ko、es、fr 六个静态语言路由。
- `/` 通过 `localStorage.lang → navigator.languages → en` 检测语言，zh 地区统一落到 zh-CN。
- 模型与字典均为类型化 TypeScript 内容模块，`satisfies` 在构建期验证数据契约。
- 页面默认使用 Server Components；客户端代码仅负责根路径检测和 Phosphor 地球图标触发的 shadcn Base UI 语言菜单。
- Metadata API 输出本地化 title、description、canonical、hreflang 与 x-default。
- Tailwind CSS 4 保持原有暖纸底、三字体、发丝线和低饱和蓝设计系统。
- `output: export` 输出 `out/`，Vercel 按 Next.js 项目零配置部署。

## 数据流

```text
src/content/models/kimi-k3.ts + src/content/i18n/*.ts
                           │
                           ▼
                  src/lib 类型与兜底层
                           │
                           ▼
             src/app/[locale] Server Components
                           │
                           ▼
              out/{locale}/index.html × 6
```

## 本地验证

```bash
pnpm dev          # Next.js + Turbopack · http://localhost:3000
pnpm build        # 生成 out/
pnpm preview      # 静态预览 · http://localhost:8080
pnpm check        # lint + typecheck + unit + build + e2e/visual
```

自动化验收包含 6 项语言/兜底单测、19 项 Chromium E2E，以及英文/中文桌面、移动端与语言菜单展开态六张视觉金本。

## 当前边界

- 只有 Kimi K3 单模型详情页；没有模型列表或多模型 URL。
- 数据是 2026-07-17 人工快照；没有后端、数据库、ISR 或自动采集。
- 根路径语言检测依赖浏览器 API；无 JavaScript 时链接到 `/en/`。
- ja、ko、es、fr 仍以 AI 翻译为主，英文是最终兜底。
- canonical 域名固定为 `https://aievalindex.vercel.app`，生产部署尚未验收。

## 下一步

1. 连接 Vercel 并验证七个公开路由、静态资源、canonical 与 hreflang。
2. 完成 zh-CN 内容终校并抽查其他语言术语。
3. 若进入多模型阶段，先定义 slug 与模型目录索引，不在单模型页面堆条件分支。
