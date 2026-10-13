# boards/

> L2 | 父级: ../README.md

成员清单
webdev.json: LMArena WebDev 142 行，2026-10-10 从 arena.ai/leaderboard/code/webdev 解析
image-to-webdev.json: LMArena Image-to-WebDev 64 行，2026-10-11 从 arena.ai/leaderboard/code/image-to-webdev 解析，榜单日期 2026-10-09。pareto 与 paretoPrice 只属于帕累托页列出的 6 个最优点，blend 是 (输入 + 3×输出) / 4
android-1.json: Android Bench 历史版本 1.0 的 32 行，基准 slug 是 android-bench
android-long.json: Android Bench 当前版本 2.0 长程的 10 行，同一基准 slug
terminal.json: Terminal-Bench 4.0 的 35 行 display
sudo.json: sudo L7 的 12 行，按页面顺序
deepswe.json: DeepSWE v1.1 的 28 行 Best 配置，2026-10-11 从 https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json 抓取（generated_at 2026-09-22）；每模型只保留 Pass@1 最高的一档推理配置
frontiercode.json: FrontierCode 1.1 Main 的 130 行（43 模型 × 全部推理档），2026-10-13 从 https://cognition.com/data/frontiercode-leaderboard/data.json 的 v1_1 抓取；与页面 All reasoning levels 一致，# 为最佳推理档名次
slop-index.json: The Slop Index 39 行，2026-10-11 从 theslopindex.com/leaderboard 抓取；来源是 slop 越高越差、#1 最渣，本站反转为最少 slop 为 #1，score 存 100 − Slop Score
eqbench-creative-writing.json: EQ-Bench Creative Writing v3 140 行，2026-10-12 从 eqbench.com/creative_writing.html 的 creative_writing.js（v=1.0.91）嵌入 CSV 抓取；主指标归一化 Elo（越高越好）

这些文件是来源页的逐行副本。`results.ts` 只做模型页映射，不删行、不重排。框架评测的行写在 `results.ts`，不进这些 JSON。Slop Index 是唯一在入库前反转名次与分数方向的榜，说明写在基准与场景文案里。

Android 的两份 JSON 是同一个基准的两个版本，不是两个场景列。场景、首页和 90 天判断只用 `current`。ReactBench、Terminal-Bench、Convex 仍是单条 `version` 字符串，没有第二份可核对的原榜，所以不拆成 `versions`。

## 融合表的模型对齐

场景页的融合表不另存一份分数。对齐规则：

- 有 `modelSlug` 的行是同一个模型。`:max`、`:high` 这类 `effort`，以及 `agent` harness，留在原行里。
- 每一列只取该模型在这张榜基线臂上名次最好的一行。名次相同则分数更高的一行。
- 格子悬停带上与目录名不同的来源 `label`、`effort` 和 `agent`，用来说明用的是哪一档。
- 没有 `modelSlug` 的行按 `label` 单独成行，不用名字去猜另一张榜。
- 融合表格子仍是各榜原始名次；模型没出现在某一张榜上，格子是「—」。完整原榜在基准页。
- 默认排序与首页卡片用方法 C 综合分（见 `src/lib/composite.ts`）：每张榜相对榜首归一化（榜首 100；竞技场按对榜首胜率，通过率按比值），再按场景 `boards[].weight` 加权；缺榜按该榜中位水平半权计入；初步行半权。综合分只用于排序和首页摘要，不替代格子里的原始名次/分数。
- 融合表列序、评分模态权重表与小多图均按 `boards[].weight` 降序（同权保持声明顺序），不硬编码。
- Web 前端权重（列序）：WebDev 1.0、Image-to-WebDev 0.6、sudo L7 0.6、DeepSWE v1.1 0.6、FrontierCode 1.1 0.6、Next.js 0.4、ReactBench 0.4。Android 权重：Android Bench 当前版本 1.0、sudo L7 0.6、DeepSWE v1.1 0.6、FrontierCode 1.1 0.6。CLI 权重：Terminal-Bench 1.0、DeepSWE v1.1 0.6、FrontierCode 1.1 0.6。写文档和文案：Slop Index 1.0、EQ-Bench Creative Writing v3 0.6（竞技场 Elo）。sudo L7、DeepSWE 与 FrontierCode 是通用编码 / 长程工程 / 可合并性榜（`scope: general`，通过率），按比值相对榜首归一化，可同时出现在多个场景。
- `Benchmark.scope`：`specific`（默认）最多属于一个场景；`general` 可跨场景复用（目前 sudo L7、DeepSWE v1.1 与 FrontierCode 1.1）。构建期只对 specific 做“一张榜一个场景”校验。
- 综合分四舍五入后同分并列；并列后再比主榜名次。首页卡片还要求出现在主榜、已观测权重 ≥ 总权重 50%（Web 前端即 ≥ 2.1 / 4.2，Android 即 ≥ 1.4 / 2.8，CLI 即 ≥ 1.1 / 2.2，写文档即 ≥ 0.8 / 1.6），且有模型页。
- 基准有 `versions` 时，这一列只用 `current` 那一版。归档版本留在基准页。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
