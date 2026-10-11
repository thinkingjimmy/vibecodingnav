# boards/

> L2 | 父级: ../README.md

成员清单
webdev.json: LMArena WebDev 142 行，2026-10-10 从 arena.ai/leaderboard/code/webdev 解析
image-to-webdev.json: LMArena Image-to-WebDev 64 行，2026-10-11 从 arena.ai/leaderboard/code/image-to-webdev 解析，榜单日期 2026-10-09。pareto 与 paretoPrice 只属于帕累托页列出的 6 个最优点，blend 是 (输入 + 3×输出) / 4
android-1.json: Android Bench 历史版本 1.0 的 32 行，基准 slug 是 android-bench
android-long.json: Android Bench 当前版本 2.0 长程的 10 行，同一基准 slug
terminal.json: Terminal-Bench 4.0 的 35 行 display
sudo.json: sudo L7 的 12 行，按页面顺序

这些文件是来源页的逐行副本。`results.ts` 只做模型页映射，不删行、不重排。框架评测的行写在 `results.ts`，不进这些 JSON。

Android 的两份 JSON 是同一个基准的两个版本，不是两个场景列。场景、首页和 90 天判断只用 `current`。ReactBench、Terminal-Bench、Convex 仍是单条 `version` 字符串，没有第二份可核对的原榜，所以不拆成 `versions`。

## 融合表的模型对齐

场景页的融合表不另存一份分数。对齐规则：

- 有 `modelSlug` 的行是同一个模型。`:max`、`:high` 这类 `effort`，以及 `agent` harness，留在原行里。
- 每一列只取该模型在这张榜基线臂上名次最好的一行。名次相同则分数更高的一行。
- 格子悬停带上与目录名不同的来源 `label`、`effort` 和 `agent`，用来说明用的是哪一档。
- 没有 `modelSlug` 的行按 `label` 单独成行，不用名字去猜另一张榜。
- 模型没出现在某一张榜上，格子是「—」，不估算，也不把不同评测的分数合成一个数。
- 默认排序只平均模型实际出现的榜。平均名次相同，出现的榜更多者在前，再比场景主榜名次。
- 基准有 `versions` 时，这一列只用 `current` 那一版。归档版本留在基准页。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
