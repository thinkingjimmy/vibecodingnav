# boards/

> L2 | 父级: ../README.md

成员清单
webdev.json: LMArena WebDev 159 行，2026-11-17 从 lmarena.ai/leaderboard/webdev 的公开榜解析（页面日期 2026-11-13，1,007,405 票）。158 行有正式名次。Claude Fable 5.2 xHigh 是正式第 1（1826，1,445 票）。新增正式行 qwen4-max-xhigh 第 6（1750，初步，1,814 票），无 modelSlug。gemini-4-hydrogen-high 现为第 11（1704，初步）。1 行 provisional=autoeval 仍是 Ernie 5.5 Flash Preview（1668，votes N/A，无 rank）。上一份的 glm-5v-turbo 这次没有出现。主榜 Cost/Task (P50) 列在可读抓取中为空，未入库
convex-no.json: Convex 112 题 No Guidelines 的历史快照，44 行，2026-11-12，本轮未改。哈希 92a60e0bb2f156b5ac44e6ea3f5d03a91deb434b9d002d14819d1fc2b6e35cdb
convex-with.json: Convex 112 题 With Guidelines 的历史快照，2026-11-18，本轮未改。不和 124 题混表
convex-124-no.json: 当前 124 题 No Guidelines，2026-11-19 抓取，哈希 32c305f646a2a7502c4112e31ed48f5cb36f022650b026fac526a2e8a8c78453，2 行
convex-124-with.json: 当前 124 题 With Guidelines，同一哈希和日期，2 行。Step 5 Preview 没有 modelSlug
image-to-webdev.json: LMArena Image-to-WebDev 66 行，2026-11-17 从 lmarena.ai/leaderboard/image-to-webdev 解析，榜单日期 2026-11-13，213,813 票。新增正式行 qwen4-max-xhigh 第 6（1674，初步），无 modelSlug。MiMo-V2.6-Flash 第 21。DeepSeek 20260910 第 13、20261017 第 14，两行分开。pareto 只属于帕累托页列出的 6 个模型；paretoTaskCost 是该页印出的单任务成本（Opus $7.48、Sonnet $2.35、GPT-6 Sol Max $1.93、Muse $1.19、DeepSeek 20260910 $0.06、MiMo $0.05）；paretoPrice 与 blend 仍是榜上 token 价的 (输入 + 3×输出) / 4，因为主榜没有单任务成本数值。上一份的 glm-5v-turbo 这次没有出现
android-1.json: Android Bench 历史版本 1.0 的 32 行，基准 slug 是 android-bench。2026-11-09 与页面 August 11th 表逐格核对，32 行一致，未改
android-long.json: Android Bench 当前版本 2.0 长程的 18 行。2026-11-19 从 developer.android.com/bench 解析，页面写 Latest results as of November 18th。Claude Fable 5.2（max）与 Claude Sonnet 5.5（max）都是 40.0，并列第 1，来源 Fable 在前。1.0 未改
terminal.json: Terminal-Bench 4.0 的 35 行 display
sudo.json: sudo L7 公开主榜 24 行，2026-11-19 解析（不含 DAYJOB / GDP.xlsx）。CMS rank 全是 1，这里用分数语义名次，同分并列。Gemini 4 Neon、GPT 6.2 Astra、GPT 6.2 Sol、Gemini 4 Hydrogen 没有 modelSlug
deepswe.json: DeepSWE v1.1 的 28 行 Best 配置，2026-10-11 从 https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json 抓取（generated_at 2026-09-22）；每模型只保留 Pass@1 最高的一档推理配置
frontiercode.json: FrontierCode 2.0 Main 的 102 行（26 模型 × 全部推理档），2026-10-28 从 https://cognition.com/data/frontier-code-2.0/data.json 抓取；# 为最佳推理档名次；完整 JSON 含 Obsidian 3（公开 HTML 表省略）
frontiercode-1.json: FrontierCode 1.1 Main 的 130 行归档，2026-10-13 从旧 data.json 的 v1_1 抓取
slop-index.json: The Slop Index 70 行，2026-11-18 用 theslopindex.com/bench.json（full-merged-v6，70 个模型、77,943 条生成，Last-Modified Wed, 18 Nov 2026 00:58:42 GMT）和 /api/leaderboard?mode=v1&domain=all 的现场 Elo 重算。响应 Date 为 Wed, 18 Nov 2026 01:02:49 GMT，2,589 票，70 行都有 Elo，没有 Last-Modified。上一份没有 Elo 的 6 行这次都有人群分，不再记中性 50。来源 Slop Score 越高越差、#1 最渣；本站反转，score 存 100 − 页面四舍五入后的 Slop Score。sourceSlop 是该整数，sourceSlopRaw 是未四舍五入的来源分，arena/concise/templating/rhythm/tells 是页面上各轴的整数。Mercury 2.5、Hunyuan 4、Inkling 2 Small、Nex N2.6、Qwen4 Max 等没有 modelSlug 的行仍保留
eqbench-creative-writing.json: EQ-Bench Creative Writing v3 146 行，2026-10-29 从 eqbench.com/creative_writing.html 的 creative_writing.js（v=1.0.91）嵌入 CSV 抓取；主指标归一化 Elo（越高越好）

这些文件是来源页的逐行副本。`results.ts` 只做模型页映射，不删行、不重排。框架评测的行写在 `results.ts`，不进这些 JSON。Slop Index 是唯一在入库前反转名次与分数方向的榜，说明写在基准与场景文案里。

Android 的两份 JSON、FrontierCode 的两份 JSON 各自是同一个基准的两个版本，不是两个场景列。场景、首页和 90 天判断只用 `current`。ReactBench、Terminal-Bench、Convex 仍是单条 `version` 字符串，没有第二份可核对的原榜，所以不拆成 `versions`。

## 融合表的模型对齐

场景页的融合表不另存一份分数。对齐规则：

- 有 `modelSlug` 的行是同一个模型。`:max`、`:high` 这类 `effort`，以及 `agent` harness，留在原行里。
- 每一列只取该模型在这张榜基线臂上名次最好的一行。名次相同则分数更高的一行。
- 格子悬停带上与目录名不同的来源 `label`、`effort` 和 `agent`，用来说明用的是哪一档。
- 没有 `modelSlug` 的行按 `label` 单独成行，不用名字去猜另一张榜。
- 融合表格子仍是各榜原始名次；模型没出现在某一张榜上，格子是「—」。完整原榜在基准页。
- 默认排序与首页卡片用方法 C 综合分（见 `src/lib/composite.ts`）：每张榜相对榜首归一化（榜首 100；竞技场按对榜首胜率，通过率按比值），再按场景 `boards[].weight` 加权；缺榜按该榜中位水平半权计入；初步行半权。综合分只用于排序和首页摘要，不替代格子里的原始名次/分数。
- 融合表列序、评分模态权重表与小多图均按 `boards[].weight` 降序（同权保持声明顺序），不硬编码。
- Web 前端权重（列序）：WebDev 1.0、Image-to-WebDev 0.6、sudo L7 0.6、DeepSWE v1.1 0.6、FrontierCode 0.6、Next.js 0.4、ReactBench 0.4。Android 权重：Android Bench 当前版本 1.0、sudo L7 0.6、DeepSWE v1.1 0.6、FrontierCode 0.6。CLI 权重：Terminal-Bench 1.0、DeepSWE v1.1 0.6、FrontierCode 0.6。写文档和文案：Slop Index 1.0、EQ-Bench Creative Writing v3 0.6（竞技场 Elo）。sudo L7、DeepSWE 与 FrontierCode 是通用编码 / 长程工程 / 可合并性榜（`scope: general`，通过率），按比值相对榜首归一化，可同时出现在多个场景。
- `Benchmark.scope`：`specific`（默认）最多属于一个场景；`general` 可跨场景复用（目前 sudo L7、DeepSWE v1.1 与 FrontierCode）。构建期只对 specific 做“一张榜一个场景”校验。
- 综合分四舍五入后同分并列；并列后再比主榜名次。首页卡片还要求出现在主榜、已观测权重 ≥ 总权重 50%（Web 前端即 ≥ 2.1 / 4.2，Android 即 ≥ 1.4 / 2.8，CLI 即 ≥ 1.1 / 2.2，写文档即 ≥ 0.8 / 1.6），且有模型页。
- 基准有 `versions` 时，这一列只用 `current` 那一版。归档版本留在基准页。

[PROTOCOL]: 变更时更新此头部，然后检查 README.md
