# models/

> L2 | 父级: ../README.md

成员清单
catalog.ts: Header 模型目录的厂商分组、官方 logo、展示分数、语义状态与可用 slug
gpt-5-6-sol.ts: 2026-07-20 GPT-5.6 Sol (max) 数据快照，承载 OpenAI 厂商身份、模型级六语言 SEO、Artificial Analysis 核心指标、对照数据与来源结论，满足 `ModelEvaluation` 契约
kimi-k3.ts: 2026-07-17 Kimi K3 数据快照、带单位/色调的顶部指标、多语言社区结论与四条真实评价原声流元数据（逐语言正负关键短语），满足 `ModelEvaluation` 契约

跑分名、模型名、数字和 URL 不翻译；厂商 logo/官网、模型级 SEO 与专属指标说明跟随模型内容维护；可翻译内容使用 `LocalizedText`，en 必填。原声流的 positive / negative 关键短语按 locale 维护，必须能在对应摘要中精确匹配。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
