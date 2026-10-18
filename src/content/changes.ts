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
