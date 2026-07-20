/**
 * [INPUT]: 依赖 src/lib/contracts 的 ModelEvaluation 类型，核心指标来自 2026-07-20 Artificial Analysis 指定页面快照
 * [OUTPUT]: 对外提供 GPT-5.6 Sol (max) 的厂商身份、模型级 SEO、顶部指标、对照数据、来源摘要与结论
 * [POS]: src/content/models 的 OpenAI 模型内容模块，被 src/lib/model.ts 注册并供六语言详情路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ModelEvaluation } from "@/lib/contracts";

const artificialAnalysisUrl = "https://artificialanalysis.ai/models/gpt-5-6-sol";

const evaluation = {
  updated: "2026-07-20",

  meta: {
    title: {
      en: "GPT-5.6 Sol (max) — Intelligence, Speed & Price | AIEvalIndex",
      "zh-CN": "GPT-5.6 Sol (max) — 智能、速度与价格 | AIEvalIndex",
      ja: "GPT-5.6 Sol (max) — 知能・速度・価格 | AIEvalIndex",
      ko: "GPT-5.6 Sol (max) — 지능·속도·가격 | AIEvalIndex",
      es: "GPT-5.6 Sol (max) — Inteligencia, velocidad y precio | AIEvalIndex",
      fr: "GPT-5.6 Sol (max) — Intelligence, vitesse et prix | AIEvalIndex",
    },
    description: {
      en: "Independent GPT-5.6 Sol (max) model profile covering intelligence, output speed, pricing, latency, context and source-linked analysis.",
      "zh-CN": "GPT-5.6 Sol (max) 独立模型档案，涵盖智能、输出速度、价格、延迟、上下文与可追溯来源分析。",
      ja: "GPT-5.6 Sol (max) の知能、出力速度、価格、レイテンシ、コンテキストを出典付きでまとめた独立プロフィール。",
      ko: "GPT-5.6 Sol (max)의 지능, 출력 속도, 가격, 지연 시간, 컨텍스트를 출처와 함께 정리한 독립 프로필입니다.",
      es: "Perfil independiente de GPT-5.6 Sol (max) con inteligencia, velocidad, precio, latencia, contexto y fuentes enlazadas.",
      fr: "Profil indépendant de GPT-5.6 Sol (max) : intelligence, vitesse, prix, latence, contexte et sources vérifiables.",
    },
  },

  model: {
    name: "GPT-5.6 Sol (max)",
    kicker: "Reasoning · Multimodal",
    vendor: "OpenAI",
    vendorLogo: "/model-logos/openai.svg",
    vendorUrl: "https://openai.com/",
    params: "Undisclosed",
    architecture: "size",
    context: "1M",
    modality: "Text + Image",
    license: "Proprietary",
    released: "2026-07-09",
    openWeights: "Not available",
  },

  pricing: { input: 5, output: 30, cached: 0.5 },

  performance: {
    outputSpeed: "62 tokens/s",
    speedRank: "#92 / 187",
    ttft: "128.22 s",
    verbosity: "70M tokens",
  },

  anchors: [
    { name: "Claude Fable 5", label: "Fable 5" },
    { name: "Kimi K3", label: "Kimi K3" },
    { name: "Claude Opus 4.8", label: "Opus 4.8" },
  ],

  heroStats: [
    {
      value: "59",
      unit: "idx",
      badge: "#2/187",
      bar: 92,
      tone: "accent",
      labelKey: "intelligence",
      subKey: "intelligenceSub",
      sub: { en: "leading tier · peer median 31", "zh-CN": "领先梯队 · 同类中位数 31" },
    },
    {
      value: "62",
      unit: "tokens/s",
      badge: "#92/187",
      bar: 48,
      tone: "neutral",
      labelKey: "speed",
      subKey: "speedSub",
      sub: { en: "below peer median 78.7", "zh-CN": "低于同类中位数 78.7" },
    },
    {
      value: "$5/$30",
      unit: "",
      badge: "#158/187",
      bar: 24,
      tone: "neutral",
      labelKey: "price",
      subKey: "priceSub",
      sub: { en: "in / out · cache $0.50", "zh-CN": "输入 / 输出 · 缓存 $0.50" },
    },
    {
      value: "1M",
      unit: "tokens",
      badge: "top tier",
      bar: 95,
      tone: "accent",
      labelKey: "context",
      subKey: "contextSub",
      sub: { en: "≈ 1,500 A4 pages", "zh-CN": "约 1,500 页 A4 文档" },
    },
  ],

  benchmarks: [
    {
      name: "Intelligence Index v4.1",
      sourceLabel: "Artificial Analysis",
      url: artificialAnalysisUrl,
      score: "59",
      detail: "#2 / 187",
      peers: { "Claude Fable 5": "60", "Kimi K3": "57", "Claude Opus 4.8": "60" },
      note: "Reasoning profile measured through OpenAI's first-party API",
    },
    {
      name: "Output Speed",
      sourceLabel: "Artificial Analysis",
      url: artificialAnalysisUrl,
      score: "62",
      detail: "tokens/s · #92 / 187",
      peers: { "Kimi K3": "62" },
      note: "First-party API measurement after the first streamed chunk",
    },
    {
      name: "Context Window",
      sourceLabel: "Artificial Analysis",
      url: artificialAnalysisUrl,
      score: "1M",
      detail: "tokens",
      peers: { "Kimi K3": "1M" },
      note: "Maximum combined input and output context",
    },
  ],

  reviews: [
    {
      author: "Artificial Analysis",
      source: "blog",
      url: artificialAnalysisUrl,
      date: "2026-07-20",
      summary: {
        en: "A leading intelligence score and 1M-token context make this a high-capability reasoning model, but it is expensive, slower than comparable models, and its 128.22-second first-answer latency is unusually high.",
        "zh-CN": "领先的智能分数与 1M token 上下文让它成为高能力推理模型，但价格昂贵、速度低于同类，128.22 秒的首个答案延迟尤其高。",
        ja: "高い知能スコアと 100 万トークンのコンテキストを備える一方、高価で同等モデルより遅く、初回回答まで 128.22 秒というレイテンシは特に大きい。",
        ko: "높은 지능 점수와 100만 토큰 컨텍스트를 갖췄지만 가격이 비싸고 동급 모델보다 느리며, 첫 답변까지 128.22초가 걸리는 지연 시간은 특히 높다.",
        es: "Su inteligencia líder y el contexto de 1M de tokens ofrecen gran capacidad, pero es caro, más lento que modelos comparables y su latencia de 128,22 s hasta la primera respuesta es especialmente alta.",
        fr: "Son intelligence de premier plan et son contexte de 1 M de tokens offrent une forte capacité, mais il est cher, plus lent que ses pairs et sa latence de 128,22 s avant la première réponse est particulièrement élevée.",
      },
      pros: [{ en: "Leading intelligence score with a 1M-token context window" }],
      cons: [{ en: "High pricing and unusually long time to first answer token" }],
      feed: {
        displayName: "Artificial Analysis",
        initials: "AA",
        sourceLabel: "Model analysis",
        readMinutes: 6,
        highlights: {
          positive: {
            en: ["leading intelligence score", "1M-token context"],
            "zh-CN": ["领先的智能分数", "1M token 上下文"],
            ja: ["高い知能スコア", "100 万トークンのコンテキスト"],
            ko: ["높은 지능 점수", "100만 토큰 컨텍스트"],
            es: ["inteligencia líder", "contexto de 1M de tokens"],
            fr: ["intelligence de premier plan", "contexte de 1 M de tokens"],
          },
          negative: {
            en: ["expensive", "128.22-second first-answer latency"],
            "zh-CN": ["价格昂贵", "128.22 秒的首个答案延迟"],
            ja: ["高価", "128.22 秒というレイテンシ"],
            ko: ["가격이 비싸고", "128.22초가 걸리는 지연 시간"],
            es: ["caro", "latencia de 128,22 s"],
            fr: ["cher", "latence de 128,22 s"],
          },
        },
      },
    },
  ],

  verdict: {
    score: "4.0",
    distribution: { rave: 0, mixed: 1, critical: 0 },
    headline: {
      lead: {
        en: "Frontier intelligence,",
        "zh-CN": "前沿智能，",
        ja: "最前線の知能、",
        ko: "최전선의 지능,",
        es: "Inteligencia de frontera,",
        fr: "Intelligence de pointe,",
      },
      qualifier: {
        en: "with a steep latency and price tax.",
        "zh-CN": "代价是高延迟与高价格。",
        ja: "ただしレイテンシと価格の負担は大きい。",
        ko: "그 대가는 높은 지연 시간과 가격이다.",
        es: "con un alto coste en latencia y precio.",
        fr: "au prix d'une latence et d'un tarif élevés.",
      },
    },
    pros: [
      { en: "59 Intelligence Index score · #2 / 187", "zh-CN": "智能指数 59 分 · #2 / 187" },
      { en: "1M-token multimodal context", "zh-CN": "1M token 多模态上下文" },
    ],
    cons: [
      { en: "$5 input / $30 output per 1M tokens", "zh-CN": "每百万 token 输入 $5 / 输出 $30" },
      { en: "128.22 s to first answer token", "zh-CN": "首个答案 token 延迟 128.22 秒" },
    ],
  },

  consensus: {
    pros: [{ en: "Top-tier intelligence and long context" }],
    cons: [{ en: "Premium price and high latency" }],
  },

  sources: [{ name: "Artificial Analysis", url: artificialAnalysisUrl }],
} satisfies ModelEvaluation;

export default evaluation;
