# 当前开发基线

> 更新日期：2026-10-10
> 状态：站点已重建为 VibeCodingNav。英文在 `/`，中文在 `/zh/`。未部署，也未改 Vercel 配置。

## 当前能力

- 首页、场景榜单、模型、工具箱分类、库 / Skill / 插件 / Prompt / 工具详情、组合页、基准页和更新日志。
- 内容是类型化 TypeScript 模块。`validateContent` 在导入时检查 slug、引用和双语字段。
- 榜单挑选（榜首、价格减半、开源许可）和「出现在」反向链接在 `src/lib/catalog.ts` 构建期计算。
- 基准日期超过 90 天，或基准已停更，页面标为过期，不作为主要证据。
- 静态导出仍是 `output: export` 与 `trailingSlash: true`。

## 数据流

```text
src/content/{models,benchmarks,results,scenarios,categories,items,builds,changes}.ts
                                      │
                                      ▼
                              validateContent
                                      │
                                      ▼
                               src/lib/catalog.ts
                                      │
                                      ▼
                         src/views → src/app/(en) 与 (zh)/zh
```

## 本地验证

```bash
pnpm dev
pnpm build
pnpm preview
pnpm check
```

## 有意留在内容里的边界

- WebDev 页列出已收录的前 20 名，来源榜单跟踪 142 个模型。
- iOS 场景是编辑精选，没有分数。
- 全栈 SaaS 有场景页，没有单独的组合页。
- sudo L7 收录公开榜全部 12 行。成本列是博客里的单任务约数，榜单页本身没有成本。
- 变更日志是编辑条目，不会在分数变化时自动生成。
