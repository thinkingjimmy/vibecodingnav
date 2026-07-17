/**
 * [INPUT]: 依赖 src/lib/contracts 的 DeepPartial/Dictionary 契约与英文兜底策略
 * [OUTPUT]: 对外提供简体中文 UI 覆盖字典
 * [POS]: src/content/i18n 的中文内容模块，被 src/lib/i18n.ts 合并到英文母本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { DeepPartial, Dictionary } from "@/lib/contracts";

const dictionary = {
  "meta": {
    "title": "Kimi K3 — 跑分、竞技场排名与真实评价 | AIEvalIndex",
    "description": "Moonshot AI Kimi K3 的官方跑分、竞技场排名与人工精选社区评价——每个数字都可回溯到数据源。"
  },
  "header": {
    "language": "语言"
  },
  "hero": {
    "by": "出品",
    "released": "发布于",
    "openWeights": "开源权重",
    "params": "参数量",
    "context": "上下文",
    "license": "许可证",
    "outputSpeed": "输出速度",
    "ttft": "首 token",
    "cached": "缓存命中"
  },
  "stats": {
    "intelligence": "Intelligence Index",
    "intelligenceSub": "189 个模型中第 4 · Artificial Analysis",
    "arena": "WebDev Arena 排名",
    "arenaSub": "1679 Elo · 1,757 票",
    "price": "定价 / 每百万 token",
    "priceSub": "输入 / 输出 · 缓存命中 $0.30",
    "context": "上下文窗口",
    "contextSub": "tokens · 约 1,573 页 A4"
  },
  "bench": {
    "title": "跑分对照",
    "subtitle": "Kimi K3 对阵一线锚点模型，每个数字均可点击回源。",
    "benchmark": "跑分项",
    "source": "来源"
  },
  "reviews": {
    "title": "社区评价",
    "subtitle": "人工精选自博客、X 与 YouTube——附摘要与原文链接。",
    "consensusPros": "共识 · 优点",
    "consensusCons": "共识 · 缺点",
    "readOriginal": "阅读原文"
  },
  "footer": {
    "tagline": "AI 模型评分与真实评价，一站看懂",
    "sources": "数据来源",
    "updated": "数据核对于",
    "disclaimer": "AIEvalIndex 汇总公开跑分数据与社区评价，每个数字均可回溯到数据源。",
    "aiNote": "ja · ko · es · fr 页面由英文母本 AI 翻译，欢迎纠错。"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
