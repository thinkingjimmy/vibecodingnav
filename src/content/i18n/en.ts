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
    "tagline": "AI model scores and real-world reviews, together",
    "language": "Language"
  },
  "hero": {
    "by": "by",
    "released": "Released",
    "openWeights": "open weights due",
    "params": "params",
    "context": "context",
    "license": "license",
    "outputSpeed": "output speed",
    "ttft": "first token",
    "cached": "cache hit"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "#4 of 189 · Artificial Analysis",
    "arena": "WebDev Arena rank",
    "arenaSub": "1679 Elo · 1,757 votes",
    "price": "Pricing / 1M tokens",
    "priceSub": "input / output · cache hit $0.30",
    "context": "Context window",
    "contextSub": "tokens · ≈ 1,573 A4 pages"
  },
  "bench": {
    "title": "Benchmarks",
    "subtitle": "Kimi K3 against frontier anchors. Every number links back to its source.",
    "benchmark": "Benchmark",
    "source": "source"
  },
  "reviews": {
    "title": "Community Reviews",
    "subtitle": "Hand-curated from blogs, X and YouTube — summarized, with links to the originals.",
    "consensusPros": "Consensus · Strengths",
    "consensusCons": "Consensus · Weaknesses",
    "readOriginal": "Read original"
  },
  "footer": {
    "sources": "Data sources",
    "updated": "Data verified",
    "disclaimer": "AIEvalIndex aggregates public benchmark data and community reviews. Every figure links back to its source.",
    "aiNote": "ja · ko · es · fr pages are AI-translated from the English master; corrections are welcome."
  }
} satisfies Dictionary;

export default dictionary;
