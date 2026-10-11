# content/

> L2 | 父级: ../README.md

成员清单
i18n/: 中文与英文 UI 字典
models.ts: 模型身份、许可与编辑说明
benchmarks.ts: 基准方法论、来源、更新日期与版本
results.ts: 各基准的名次与分数；多版本基准的行带 version
image-to-webdev-chart.ts: 图生网页帕累托页的分数与混合价格
boards/: 公开榜的逐行副本，以及融合表的模型对齐说明
scenarios.ts: 场景榜单配置
categories.ts: 工具箱分类
items.ts: 库、Skill、插件、Prompt 与工具
builds.ts: 「做 X」组合，模型行引用挑选而不是抄分数
changes.ts: 编辑变更日志
validate.ts: 构建期引用、版本与字段校验
index.ts: 校验通过后的内容包

内容以 TypeScript 常量承载。页面只通过 `src/lib/catalog.ts` 读取。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
