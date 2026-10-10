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
    date: "10-09",
    kind: "board",
    source: "surgehq.ai",
    text: tx(
      "**sudo L7**：Claude Sonnet 5.5 与 Claude Opus 5.5 均为 `45%`，榜单把 Sonnet 排在前面。GPT-6 Astra `32.2%`。",
      "**sudo L7**: Claude Sonnet 5.5 and Claude Opus 5.5 both score `45%`, with Sonnet listed first. GPT-6 Astra scores `32.2%`.",
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
      "**Terminal-Bench 4.0**：GPT-6.1 Sol 以 `58.2%` 并列第 3，成本 `$0.6k`，不到 GPT-6 Astra 的五分之一。",
      "**Terminal-Bench 4.0**: GPT-6.1 Sol ties for 3rd at `58.2%`, at `$0.6k`, under a fifth of GPT-6 Astra.",
    ),
  },
  {
    date: "09-29",
    kind: "pick",
    source: "编辑",
    text: tx(
      "「做全栈 SaaS」首选调整为 **GPT-6.1 Sol**：综合成本后性价比最高。",
      "The full-stack SaaS pick moves to **GPT-6.1 Sol**: best once cost is included.",
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
