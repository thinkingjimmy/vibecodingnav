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
    "language": "语言",
    "models": "模型",
    "leaderboard": "排行榜",
    "methodology": "评测方法"
  },
  "hero": {
    "by": "出品",
    "released": "发布于",
    "weights": "开源权重",
    "weightsDue": "预计",
    "firstToken": "首 token",
    "verbosity": "输出用量",
    "parameters": "参数量",
    "modality": "模态"
  },
  "stats": {
    "intelligence": "智能指数",
    "intelligenceSub": "第 82 百分位 · 中位数 30",
    "speed": "输出速度",
    "speedSub": "低于中位数 73",
    "price": "定价 / 1M",
    "priceSub": "输入 / 输出 · 缓存 $0.30",
    "context": "上下文",
    "contextSub": "约 1,573 页 A4"
  },
  "bench": {
    "title": "跑分对照",
    "versus": "对阵",
    "anchors": "前沿锚点模型",
    "subtitle": "分数越高越好 · 每行最佳成绩加粗",
    "compare": "比较",
    "benchmark": "跑分项",
    "wins": "胜出项"
  },
  "reviews": {
    "title": "社区结论",
    "consensusPros": "优势所在",
    "consensusCons": "短板所在",
    "rave": "盛赞",
    "mixed": "褒贬不一",
    "critical": "负面",
    "takes": "份评价",
    "sources": "评价来源"
  },
  "feed": {
    "title": "社区评价",
    "headlineLead": "来自信息流的",
    "headlineQualifier": "真实声音",
    "subtitle": "每张卡片保留原平台观感",
    "positiveLabel": "亮点",
    "negativeLabel": "缺点",
    "readArticle": "阅读原文",
    "watchVideo": "观看视频",
    "minRead": "分钟阅读"
  },
  "footer": {
    "description": "一个独立、人工精选的前沿模型评估索引——每个数字都可回溯至原始来源。",
    "explore": "浏览",
    "about": "关于",
    "models": "模型",
    "leaderboards": "排行榜",
    "benchmarks": "基准测试",
    "reviews": "社区评价",
    "methodology": "方法论",
    "dataSources": "数据来源",
    "modelDataFrom": "模型数据来自",
    "updated": "更新于"
  }
} satisfies DeepPartial<Dictionary>;

export default dictionary;
