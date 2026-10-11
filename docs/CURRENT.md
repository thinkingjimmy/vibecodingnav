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
src/content/boards/*.json   公开榜的逐行副本
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

- 一个基准最多属于一个场景。场景页是融合表：格子是名次，缺席为「—」。完整原榜在基准页。Web 前端含 WebDev、Image-to-WebDev、Next.js Agent Evals、ReactBench；Android 含 1.0 与 2.0 长程；命令行只有 Terminal-Bench 4.0；生产级改动只有 sudo L7。Supabase 与 Convex 不进场景。Image-to-WebDev 为 64 行，日期 2026-10-09。
- 融合按 `modelSlug` 对齐，每列取最好名次。没有 slug 的行不跨榜猜测。默认排序是出现过的榜的平均名次，再比出现榜数和主榜名次。
- 公开榜按来源页全行收录：WebDev 142 行，Android 1.0 的 32 行，2.0 长程 10 行，Terminal-Bench 35 行，sudo L7 12 行。开源权重是基准页上的筛选，不重排名次。超过 20 行可展开全部。滚动时筛选和表头吸在导航下。场景融合表的列头同样吸在导航下。
- 「用开源模型做前端」和「大型重构与迁移」已移除。静态页分别转到 WebDev 基准页和 Android 长程基准页。`output: export` 不支持配置里的 redirect。
- 「做全栈 SaaS」和「做 iOS App」已从场景移除。构建期拒绝两个场景引用同一张基准。全栈仍有组合页 `/build/saas/`，模型取自命令行场景的 Terminal-Bench，框架评测分别引用。iOS 旧地址转到场景列表，SaaS 旧地址转到组合页。
- 首页和场景列表是同一套 4 张卡片，两列排列。
- sudo L7 没有成本列。博客里的单任务约数只出现在基准说明。Android 1.0 表本身没有单独日期，asOf 用来源页最新更新 2026-10-06。
- 框架评测挂在库和规则条目上。默认名次是无 Skills、无指南、无 AGENTS.md。ReactBench v1.2 标成生态评测。Convex With Guidelines 未核实，不列入变化量。
- 变更日志是编辑条目，不会在分数变化时自动生成。
