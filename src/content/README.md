# content/

> L2 | 父级: ../README.md

成员清单
i18n/: 中文与英文 UI 字典
models.ts: 模型身份、许可与编辑说明
benchmarks.ts: 基准方法论、来源与更新日期
results.ts: 各基准的名次与分数
boards/: 场景榜的来源行，逐行对照公开榜
scenarios.ts: 场景榜单配置
categories.ts: 工具箱分类
items.ts: 库、Skill、插件、Prompt 与工具
builds.ts: 「做 X」组合，模型行引用挑选而不是抄分数
changes.ts: 编辑变更日志
validate.ts: 构建期引用与字段校验
index.ts: 校验通过后的内容包

内容以 TypeScript 常量承载。页面只通过 `src/lib/catalog.ts` 读取。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
