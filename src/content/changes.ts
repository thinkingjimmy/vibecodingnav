/**
 * [INPUT]: 依赖 ChangeEntry 契约
 * [OUTPUT]: 对外提供首页与 /changes 使用的变更记录
 * [POS]: src/content 的编辑日志，不替代榜单上的分数
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ChangeEntry, LText } from "@/lib/contracts";

const tx = (zh: string, en: string): LText => ({ zh, en });

export const changes: ChangeEntry[] = [
  {
    date: "11-10",
    kind: "board",
    source: "lmarena.ai / convex.dev",
    text: tx(
      "**WebDev 与 Convex**：WebDev 页面日期仍是 11-08（984,664 票）。156 个模型里 155 行有正式名次，Opus 5.5 Max 仍第 1（1818）。Claude Fable 5.2 xHigh 1832 是 AutoEval，没有名次和票数，不进综合分。Convex 无指南 43 行，Fable 5.2 95.54% 第 1，Astra 89.73% 第 2；有指南 42 行，Fable 5.2 99.11% 第 1，Argon 98.75% 第 2。两列分开，仍只在框架页。",
      "**WebDev and Convex**: the WebDev page date is still Nov 8 (984,664 votes). Of 156 models, 155 have official ranks; Opus 5.5 Max is still #1 (1818). Claude Fable 5.2 xHigh at 1832 is AutoEval, with no rank and no votes, and it stays out of the composite. Convex No Guidelines has 43 rows, Fable 5.2 at 95.54% then Astra at 89.73%. With Guidelines has 42 rows, Fable 5.2 at 99.11% then Argon at 98.75%. The columns stay separate and framework-only.",
    ),
  },
  {
    date: "11-09",
    kind: "board",
    source: "lmarena.ai / developer.android.com",
    text: tx(
      "**三榜同步**：LMArena WebDev 至 11-08（985,908 票、154 行），Opus 5.5 Max 第 1（1818），Sonnet 5.5 xHigh 升至第 2（1773），Carbon High 第 3（1768，初步）。Image-to-WebDev 仍 65 行（208,770 票），Fable 5.1 升至第 3（1724），帕累托页改为 6 个模型并改印单任务成本。Android Bench 2.0 长程 14 行（页面日期 11-04）：新增 GPT 6.1 Terra max 第 4（28.7）、Kimi K3.1 Pro max 第 6（24.0）、Deepseek V4.1 Flash 1017 high 第 9（17.3）。Next.js 未改。",
      "**Three-board sync**: LMArena WebDev to Nov 8 (985,908 votes, 154 rows); Opus 5.5 Max #1 (1818); Sonnet 5.5 xHigh rises to #2 (1773); Carbon High #3 (1768, preliminary). Image-to-WebDev stays 65 rows (208,770 votes); Fable 5.1 rises to #3 (1724); the Pareto page now lists six models and prints cost per task. Android Bench 2.0 long-horizon is 14 rows (page date Nov 4): new GPT 6.1 Terra max #4 (28.7), Kimi K3.1 Pro max #6 (24.0), Deepseek V4.1 Flash 1017 high #9 (17.3). Next.js was not changed.",
    ),
  },
  {
    date: "10-29",
    kind: "board",
    source: "lmarena.ai / eqbench.com",
    text: tx(
      "**两榜同步**：LMArena WebDev 至 10-27（952,039 票、153 行），Opus Max 仍第 1（1810）；新增 **Gemini 4 Carbon（high）** 第 4（1768，初步）。EQ Creative Writing 146 行，Astra 仍第 1（Elo 2176.9）；**Kimi K3.1 Pro** 新进第 2（2172.6）。",
      "**Two-board sync**: LMArena WebDev to Oct 27 (952,039 votes, 153 rows); Opus Max still #1 (1810); new **Gemini 4 Carbon (high)** at #4 (1768, preliminary). EQ Creative Writing 146 rows; Astra still #1 (Elo 2176.9); **Kimi K3.1 Pro** enters at #2 (2172.6).",
    ),
  },
  {
    date: "10-28",
    kind: "board",
    source: "surgehq.ai / lmarena.ai / theslopindex.com / developer.android.com / cognition.com / convex.dev",
    text: tx(
      "**六榜同步**：sudo L7 16 行，Sonnet 5.5 `50.6%` 居首；Kimi K3.1 Pro 与 Qwen 并列第 6。WebDev 至 10-27（950,329 票、152 行），Opus Max 仍第 1；新增 **GPT-6.1 Terra** 第 14。Slop 反转后 **Inkling Small** 第 1（76），Haiku 约第 4（旧「Haiku #1」过时）。Android Bench 2.0 11 行，Sonnet max `40.0%` 居首。FrontierCode 升级 **2.0**（102 行／26 模型；完整 JSON 含 Obsidian 3）。Convex No/With Guidelines 刷新，有指南 Argon ~98.7%。",
      "**Six-board sync**: sudo L7 16 rows, Sonnet 5.5 leads at `50.6%`; Kimi K3.1 Pro ties Qwen at #6. WebDev to Oct 27 (950,329 votes, 152 rows); Opus Max still #1; new **GPT-6.1 Terra** at #14. After Slop inversion **Inkling Small** leads (76); Haiku about #4 (old “Haiku #1” stale). Android Bench 2.0 11 rows, Sonnet max `40.0%` leads. FrontierCode upgraded to **2.0** (102 rows / 26 models; complete JSON includes Obsidian 3). Convex No/With Guidelines refreshed; With Guidelines Argon ~98.7%.",
    ),
  },
  {
    date: "10-26",
    kind: "board",
    source: "lmarena.ai / theslopindex.com / eqbench.com / convex.dev",
    text: tx(
      "**四榜同步**：LMArena WebDev 至 2026-10-22（923,854 票、151 行），新增 Moonshot **Kimi K3.1 Pro（max）** 第 8（`1692`，初步）。Slop Index 扩至 58 行（2,091 票），反转后 **Haiku 5.5** 第 1（100−17=83）。EQ Creative Writing 145 行，Meta **muse-wonder** 第 9（Elo `2007.0`）。Convex With Guidelines 刷新，Claude Opus 5 第 9（`94.64%`）。",
      "**Four-board sync**: LMArena WebDev to 2026-10-22 (923,854 votes, 151 rows); new Moonshot **Kimi K3.1 Pro (max)** at #8 (`1692`, preliminary). Slop Index expands to 58 rows (2,091 votes); after inversion **Haiku 5.5** leads (100−17=83). EQ Creative Writing 145 rows; Meta **muse-wonder** at #9 (Elo `2007.0`). Convex With Guidelines refreshed; Claude Opus 5 at #9 (`94.64%`).",
    ),
  },
  {
    date: "10-20",
    kind: "board",
    source: "lmarena.ai / convex.dev",
    text: tx(
      "**四榜同步**：LMArena WebDev 至 2026-10-19（903,893 票、149 行），Opus 5.5（max）`1807` 居首，新增 Muse Wonder Full（max）第 6（`1726`）。Image-to-WebDev 至 2026-10-19（191,568 票、65 行），Opus 5.5（max）`1753` 居首，DeepSeek-V4.1-Flash-20260910（max）第 13（`1606`）。Convex No / With Guidelines 各 38 个模型，新增 GPT-5.5 第 14（`77.68%`）／第 17（`89.29%`）。",
      "**Four-board sync**: LMArena WebDev to 2026-10-19 (903,893 votes, 149 rows); Opus 5.5 (max) leads at `1807`; new Muse Wonder Full (max) at #6 (`1726`). Image-to-WebDev to 2026-10-19 (191,568 votes, 65 rows); Opus 5.5 (max) leads at `1753`; DeepSeek-V4.1-Flash-20260910 (max) at #13 (`1606`). Convex No / With Guidelines have 38 models each; new GPT-5.5 at #14 (`77.68%`) / #17 (`89.29%`).",
    ),
  },
  {
    date: "10-19",
    kind: "board",
    source: "lmarena.ai / reactbench.com / convex.dev",
    text: tx(
      "**三榜同步**：LMArena WebDev 至 2026-10-19（900,155 票、146 行），Opus 5.5（max）`1806` 居首，新增 DeepSeek-V4.1-Flash-20261017（max）第 12（`1670`）。ReactBench v1.2 重同步（85 配置），Opus 5.5（max）`54.4%` 第 1。Convex 补上 With Guidelines，并刷新 No Guidelines / Web。",
      "**Three-board sync**: LMArena WebDev to 2026-10-19 (900,155 votes, 146 rows); Opus 5.5 (max) leads at `1806`; new DeepSeek-V4.1-Flash-20261017 (max) at #12 (`1670`). ReactBench v1.2 resynced (85 configs) with Opus 5.5 (max) `54.4%` at #1. Convex adds With Guidelines and refreshes No Guidelines / Web.",
    ),
  },
  {
    date: "10-18",
    kind: "pick",
    source: "reactbits.dev",
    text: tx(
      "**React Bits**：按官网重写动效分类一句话说明（免费开源动画 React 组件，可复制源码），并补全仓库与 shadcn 安装示例。",
      "**React Bits**: refreshed the Motion one-liner from the site (free open-source animated React components, copyable source), plus repo and a shadcn install example.",
    ),
  },
  {
    date: "10-14",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**LMArena WebDev**：同步至 2026-10-13 榜（878,407 票、143 行）。Claude Opus 5.5（max）`1811` 仍居首；新增 Meta **muse-wonder-max** 第 15（`1651`）。",
      "**LMArena WebDev**: synced to the 2026-10-13 board (878,407 votes, 143 rows). Claude Opus 5.5 (max) still leads at `1811`; new Meta **muse-wonder-max** at #15 (`1651`).",
    ),
  },
  {
    date: "10-13",
    kind: "board",
    source: "cognition.com/frontiercode",
    text: tx(
      "**FrontierCode 1.1**：Main 集 130 行（全部推理档）。Claude Opus 5.5 `54.6%`。通用榜，挂入 Web 前端 / Android / CLI，权重 0.6。",
      "**FrontierCode 1.1**: 130 Main rows (all reasoning levels). Claude Opus 5.5 `54.6%`. General board on Web frontend / Android / CLI at weight 0.6.",
    ),
  },
  {
    date: "10-12",
    kind: "board",
    source: "eqbench.com",
    text: tx(
      "**写文档和文案**：挂入 EQ-Bench Creative Writing v3，140 行 Elo；权重 0.6（Slop Index 仍 1.0）。综合分榜首 GPT-6 Astra。",
      "**Write docs & copy**: adds EQ-Bench Creative Writing v3, 140 Elo rows; weight 0.6 (Slop Index stays 1.0). Composite lead is GPT-6 Astra.",
    ),
  },
  {
    date: "10-12",
    kind: "pick",
    source: "bestfreefonts.com",
    text: tx(
      "**Best Free Fonts**：字体分类新增精选免费字体目录；强调真正免费，收录常见 SIL Open Font License。",
      "**Best Free Fonts**: added to Type—a curated free-font directory focused on truly free faces, commonly SIL Open Font License.",
    ),
  },
  {
    date: "10-11",
    kind: "board",
    source: "deepswe.datacurve.ai",
    text: tx(
      "**DeepSWE v1.1**：28 行 Best 配置。GPT 6 Astra `74.1%`，Gemini 3.8 Flash `73.8%`，Claude Opus 5 `73.6%`。通用榜，挂入 Web 前端 / Android / CLI。",
      "**DeepSWE v1.1**: 28 Best-config rows. GPT 6 Astra `74.1%`, Gemini 3.8 Flash `73.8%`, Claude Opus 5 `73.6%`. General board on Web frontend / Android / CLI.",
    ),
  },
  {
    date: "10-11",
    kind: "board",
    source: "theslopindex.com",
    text: tx(
      "**写文档和文案**：新增场景，挂 The Slop Index 39 行。来源最渣为 #1；本站反转后 GPT-5.6 Luna 居首（100 − Slop = `74`）。",
      "**Write docs & copy**: new scenario on The Slop Index, 39 rows. Source ranks sloppiest first; after inversion GPT-5.6 Luna leads (100 − Slop = `74`).",
    ),
  },
  {
    date: "10-09",
    kind: "board",
    source: "arena.ai",
    text: tx(
      "**LMArena Image-to-WebDev**：64 个模型，Claude Opus 5.5（max）`1749`。图生网页，不是文字需求的 WebDev。",
      "**LMArena Image-to-WebDev**: 64 models. Claude Opus 5.5 (max) scores `1749`. This is image-to-page, not the text-prompt WebDev board.",
    ),
  },
  {
    date: "10-09",
    kind: "board",
    source: "surgehq.ai",
    text: tx(
      "**sudo L7**：Claude Opus 5.5 与 Claude Sonnet 5.5 均为 `45%`，页面先列 Opus。GPT 6 Astra `32.2%`。",
      "**sudo L7**: Claude Opus 5.5 and Claude Sonnet 5.5 both score `45%`, with Opus listed first. GPT 6 Astra scores `32.2%`.",
    ),
  },
  {
    date: "10-08",
    kind: "board",
    source: "lmarena.ai",
    text: tx(
      "**LMArena WebDev**：Claude Opus 5.5（max）以 `1813` 分居首，领先 GPT-6 Astra `27` 分。",
      "**LMArena WebDev**: Claude Opus 5.5 (max) leads at `1813`, 27 points ahead of GPT-6 Astra.",
    ),
  },
  {
    date: "09-29",
    kind: "board",
    source: "tbench.ai",
    text: tx(
      "**Terminal-Bench 4.0**：GPT-6.1 Sol 以 `58.2%` 并列第 3，成本 `$634.24`。",
      "**Terminal-Bench 4.0**: GPT-6.1 Sol ties for 3rd at `58.2%`, at `$634.24`.",
    ),
  },
  {
    date: "09-29",
    kind: "pick",
    source: "编辑",
    text: tx(
      "全栈组合的模型改为 Terminal-Bench 上的 **GPT-6.1 Sol**：综合成本后性价比最高。",
      "The full-stack set uses **GPT-6.1 Sol** from Terminal-Bench: best once cost is included.",
    ),
  },
  {
    date: "09-22",
    kind: "board",
    source: "tbench.ai",
    text: tx(
      "**Terminal-Bench 4.0**：Claude Opus 5.5 以 `64.8%` 登顶。",
      "**Terminal-Bench 4.0**: Claude Opus 5.5 takes first at `64.8%`.",
    ),
  },
  {
    date: "08-11",
    kind: "board",
    source: "android.com",
    text: tx(
      "**Android Bench**：新增 Claude Opus 5、GPT 5.6 Sol / Luna / Terra、Kimi K3、Qwen3.8 Max 等 8 个模型。",
      "**Android Bench**: adds eight models, including Claude Opus 5, GPT 5.6 Sol / Luna / Terra, Kimi K3, and Qwen3.8 Max.",
    ),
  },
  {
    date: "—",
    kind: "method",
    source: "编辑",
    text: tx(
      "SWE-bench Verified 自 2026 年 2 月起未收录新一代模型，暂不作为主要证据。",
      "SWE-bench Verified has not listed a new model generation since February 2026, so it is not primary evidence.",
    ),
  },
];
