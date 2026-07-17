/**
 * [INPUT]: 无运行时依赖，承接内容层与页面层共享的数据约束
 * [OUTPUT]: 对外提供 Locale、Dictionary、LocalizedText、ModelEvaluation、DeepPartial 类型与 LOCALES 常量
 * [POS]: src/lib 的领域契约中心，是内容模块与渲染组件之间的单一类型边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
export const LOCALES = ["en", "zh-CN", "ja", "ko", "es", "fr"] as const;

export type Locale = (typeof LOCALES)[number];
export type DeepPartial<T> = T extends object
  ? { [Key in keyof T]?: DeepPartial<T[Key]> }
  : T;

export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, "en">, string>>;

export interface Dictionary {
  meta: { title: string; description: string };
  header: { language: string };
  hero: {
    by: string;
    released: string;
    openWeights: string;
    params: string;
    context: string;
    license: string;
    outputSpeed: string;
    ttft: string;
    cached: string;
  };
  stats: {
    intelligence: string;
    intelligenceSub: string;
    arena: string;
    arenaSub: string;
    price: string;
    priceSub: string;
    context: string;
    contextSub: string;
  };
  bench: { title: string; subtitle: string; benchmark: string; source: string };
  reviews: {
    title: string;
    subtitle: string;
    consensusPros: string;
    consensusCons: string;
    readOriginal: string;
  };
  footer: { tagline: string; sources: string; updated: string; disclaimer: string; aiNote: string };
}

export interface ModelEvaluation {
  updated: string;
  model: {
    name: string;
    vendor: string;
    params: string;
    architecture: string;
    context: string;
    license: string;
    released: string;
    openWeights: string;
  };
  pricing: { input: number; output: number; cached: number };
  performance: { outputSpeed: string; speedRank: string; ttft: string };
  anchors: string[];
  heroStats: Array<{
    value: string;
    labelKey: keyof Dictionary["stats"];
    subKey: keyof Dictionary["stats"];
  }>;
  benchmarks: Array<{
    name: string;
    sourceLabel: string;
    url: string;
    score: string;
    detail: string;
    peers: Partial<Record<string, string>>;
    note: string;
  }>;
  reviews: Array<{
    author: string;
    source: string;
    url: string;
    date: string;
    summary: LocalizedText;
    pros: LocalizedText[];
    cons: LocalizedText[];
  }>;
  consensus: { pros: LocalizedText[]; cons: LocalizedText[] };
  sources: Array<{ name: string; url: string }>;
}
