/**
 * [INPUT]: 依赖 src/lib/contracts 的 Dictionary 完整字典契约
 * [OUTPUT]: 对外提供英文 UI 母本与所有语言的最终兜底文案
 * [POS]: src/content/i18n 的兜底字典，被 src/lib/i18n.ts 作为合并基线消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — Benchmarks, Arena Rank & Real Reviews | AIEvalIndex",
    "description": "Official benchmarks, arena rankings and hand-curated community reviews for Moonshot AI's Kimi K3 — every figure linked back to its source."
  },
  "header": {
    "language": "Language",
    "models": "Models",
    "leaderboard": "Leaderboard",
    "methodology": "Methodology"
  },
  "hero": {
    "by": "by",
    "released": "Released",
    "weights": "Weights",
    "weightsDue": "due",
    "firstToken": "First token",
    "verbosity": "Verbosity",
    "parameters": "Parameters",
    "modality": "Modality"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "vs median 30 · Artificial Analysis",
    "speed": "Output Speed",
    "speedSub": "tok/s · below median 73",
    "price": "Price / 1M",
    "priceSub": "in / out · cache hit $0.30",
    "context": "Context Window",
    "contextSub": "tokens · ≈ 1,573 A4 pages"
  },
  "bench": {
    "title": "Benchmarks",
    "versus": "vs.",
    "anchors": "frontier anchors",
    "subtitle": "Higher is better · best in row bold",
    "benchmark": "Benchmark",
    "wins": "Wins"
  },
  "reviews": {
    "title": "Community Verdict",
    "consensusPros": "Where it wins",
    "consensusCons": "Where it lags",
    "rave": "rave",
    "mixed": "mixed",
    "critical": "critical",
    "takes": "takes",
    "sources": "Review sources"
  },
  "footer": {
    "description": "An independent, hand-curated index of frontier model evaluations — every number links back to its source.",
    "explore": "Explore",
    "about": "About",
    "models": "Models",
    "leaderboards": "Leaderboards",
    "benchmarks": "Benchmarks",
    "reviews": "Reviews",
    "methodology": "Methodology",
    "dataSources": "Data sources",
    "modelDataFrom": "Model data from",
    "updated": "updated"
  }
} satisfies Dictionary;

export default dictionary;
