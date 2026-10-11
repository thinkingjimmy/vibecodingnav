/**
 * [INPUT]: 无运行时依赖
 * [OUTPUT]: 对外提供 Locale、双语文本、内容实体与 UI 字典类型
 * [POS]: src/lib 的领域契约，内容文件与页面只依赖这里的类型
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export const LOCALES = ["en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export type LText = { zh: string; en: string };

export const ITEM_TYPES = ["library", "skill", "plugin", "prompt", "tool"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const ITEM_SEGMENT: Record<ItemType, string> = {
  library: "libraries",
  skill: "skills",
  plugin: "plugins",
  prompt: "prompts",
  tool: "apps",
};

export const VENDOR_IDS = [
  "anthropic",
  "openai",
  "kimi",
  "zhipu",
  "qwen",
  "google",
  "meta",
  "xai",
  "xiaomi",
  "tencent",
  "deepseek",
  "cursor",
  "minimax",
] as const;
export type VendorId = (typeof VENDOR_IDS)[number];

export const LICENSE_KINDS = [
  "proprietary",
  "mit",
  "apache-2.0",
  "isc",
  "ofl-1.1",
  "gpl-3.0",
  "qwen-community",
  "kimi",
] as const;
export type LicenseKind = (typeof LICENSE_KINDS)[number];

export const PERMISSIVE_LICENSES: readonly LicenseKind[] = ["mit", "apache-2.0", "isc", "ofl-1.1", "gpl-3.0"];

export type ScoreUnit = "" | "%";
export type BenchmarkKind = "framework" | "ecosystem";
/** 综合分单榜归一化：竞技场用对榜首胜率，通过率榜用比值。 */
export type CompositeKind = "arena" | "rate";
export type ResultArm = "baseline" | "assisted" | "web";
export type Ci = { kind: "pm"; value: number } | { kind: "range"; low: number; high: number };
export type ChangeKind = "board" | "pick" | "method";
export type ValueMetric = "token" | "run";
export type PickKind = "top" | "value" | "open";

export interface Model {
  slug: string;
  name: string;
  vendor: VendorId;
  vendorName: string;
  license: LicenseKind;
  licenseLabel: LText;
  context: string;
  priceLabel: string;
  agents: string[];
  summary: LText;
  why: LText[];
  whyNot: LText[];
  headlines?: string[];
  peerTable?: { benchmarks: string[]; slugs: string[] };
  fetchedAt: string;
}

export interface BenchmarkLink {
  label: string;
  href: string;
}

/** 同一基准的一个版本。当前版本只有一个；其余版本归档后仍保留完整原榜。 */
export interface BenchmarkVersion {
  id: string;
  label: LText;
  asOf: string;
  current?: boolean;
  archived?: boolean;
  /** 旧地址的查询参数或 hash，例如 long。 */
  aliases?: string[];
  table?: BoardTable;
  sourceFilter?: SourceFilter;
  trackedCount?: number;
  measures: LText;
  method: LText;
  scoreMeaning: LText;
  caveats: LText;
  updateCadence: LText;
  links?: BenchmarkLink[];
}

/** specific（默认）：最多属于一个场景。general：通用能力榜，可出现在多个场景（目前仅 sudo L7）。 */
export type BenchmarkScope = "general" | "specific";

export interface Benchmark {
  slug: string;
  name: string;
  shortName: string;
  measures: LText;
  method: LText;
  scoreMeaning: LText;
  caveats: LText;
  updateCadence: LText;
  links: BenchmarkLink[];
  asOf: string;
  scoreUnit: ScoreUnit;
  /** 场景综合分用。空单位的竞技场榜为 arena，百分比通过率为 rate。 */
  compositeKind: CompositeKind;
  /** 省略时按 specific：最多一个场景。general 可跨场景复用。 */
  scope?: BenchmarkScope;
  domain: LText;
  votes?: string;
  trackedCount?: number;
  retired?: boolean;
  kind?: BenchmarkKind;
  /** 场景榜单按来源页的列来画。框架评测不使用。有 versions 时等于当前版本。 */
  table?: BoardTable;
  /** 来源页自己的筛选。筛选保留来源名次。有 versions 时等于当前版本。 */
  sourceFilter?: SourceFilter;
  /** 没有多版本原榜时的版本说明，例如 ReactBench v1.2。 */
  version?: string;
  /** 多份完整原榜。场景、首页和过期判断只用 current 那一版。 */
  versions?: BenchmarkVersion[];
  assistedLabel?: LText;
  webLabel?: LText;
}

export type BoardTable = "webdev" | "android-1" | "android-long" | "terminal" | "score";
export type SourceFilter = "license" | "weights";
export type WeightClass = "open" | "closed";

export interface Result {
  benchmark: string;
  /** 有模型页时才填。来源行没有对应模型时只保留 label。 */
  modelSlug?: string;
  /** 来源页上的模型名，榜单按它显示。 */
  label?: string;
  vendor?: VendorId;
  /** 没有厂商标时的字母。 */
  letter?: string;
  org?: string;
  licenseText?: string;
  weights?: WeightClass;
  agent?: string;
  agentOrg?: string;
  effort?: string;
  setting?: string;
  rank?: number;
  rankSpread?: string;
  score: number;
  /** 来源页上的分数原文，例如 28.0、45、64.8% ± 3.1%。 */
  scoreText?: string;
  ci?: Ci;
  ciText?: string;
  votes?: string;
  tokenPrice?: string;
  runCost?: string;
  context?: string;
  completion?: string;
  latency?: string;
  tokens?: string;
  releaseDate?: string;
  preliminary?: boolean;
  asOf: string;
  /** 多版本基准才填，并且必须对上某个版本 id。 */
  version?: string;
  arm?: ResultArm;
}

export interface EditorPick {
  modelSlug: string;
  reason: LText;
}

/** 融合表列头用的 Phosphor 图标名（kebab-case，与 @phosphor-icons/react 对应）。 */
export const SCENARIO_BOARD_ICONS = [
  "users-three",
  "image",
  "file-code",
  "atom",
  "scales",
  "device-mobile",
  "terminal-window",
] as const;
export type ScenarioBoardIcon = (typeof SCENARIO_BOARD_ICONS)[number];

export interface ScenarioBoard {
  id: string;
  benchmark: string;
  /** 短技术名，抽屉权重表等仍可用；列头改用 dimension。 */
  label: LText;
  /** 列头短白话维度名，例如「盲测投票」「还原设计」。 */
  dimension: LText;
  icon: ScenarioBoardIcon;
  /** 悬停浮层里 1–2 句：这张榜测什么。 */
  blurb: LText;
  /** 综合分权重。省略时按 1。主榜通常 1，相邻竞技场任务 0.6，厂商 / 生态评测 0.4。 */
  weight?: number;
}

export interface Scenario {
  slug: string;
  title: LText;
  /** SEO / metadata 用的较长摘要；页头不再展示。 */
  summary: LText;
  /** 页头唯一一句说明，例如「单看哪一张榜都有盲点，这里把五张合起来排。」 */
  thesis: LText;
  /** 首页卡片、挑选和组合使用的那一张来源榜。 */
  benchmark?: string;
  /** 同一场景里的多张来源表。顺序即列顺序。多版本基准只放当前版本。 */
  boards?: ScenarioBoard[];
  /** 「评分方法」模态里场景特有的注意点。 */
  scoringCaveats?: LText[];
  valueMetric: ValueMetric;
  lead: "top" | "value";
  featured: boolean;
  sourceLabel?: LText;
  editorPicks?: EditorPick[];
  whyItMatters: { title: LText; body: LText }[];
  related: string[];
  build?: string;
  note?: LText;
}

export interface ToolCategory {
  slug: string;
  title: LText;
  summary: LText;
  howToPick: { title: LText; body: LText }[];
  items: string[];
  homeItems?: string[];
  updatedAt: string;
}

export interface ItemInstall {
  label: LText;
  cmd: string;
}

export interface Item {
  slug: string;
  type: ItemType;
  name: string;
  oneLiner: LText;
  fitFor: LText;
  license?: string;
  homepage?: string;
  repo?: string;
  version?: string;
  platforms?: string;
  author?: string;
  format?: string;
  updatedAt?: string;
  install: ItemInstall[];
  installNote?: LText;
  usage?: { label: LText; cmd: string };
  whyPick: LText;
  whenNot: LText;
  caveats?: LText;
  agentSnippet?: string;
  peers: string[];
  does?: { title: LText; body: LText }[];
  compatible?: { agent: string; note: LText; via: string }[];
  sources?: string[];
  verifiedAt: string;
  visual?: "phosphor-weights";
  relatedItem?: string;
  mark?: VendorId;
  eval?: { benchmark: string; mode: "board" | "uplift" | "unverified"; note?: LText };
}

export type RoleRef =
  | { kind: "pick"; pick: PickKind }
  | { kind: "model"; slug: string }
  | { kind: "item"; slug: string };

export interface BuildRole {
  role: LText;
  primary: RoleRef;
  extras?: RoleRef[];
  meta?: LText;
  alternatives: { ref: RoleRef; tone: "value" | "open" | "note"; when: LText }[];
}

export interface BuildPage {
  slug: string;
  scenario: string;
  title: LText;
  summary: LText;
  roles: BuildRole[];
  agentsMd: LText;
  installCmds: LText;
  notFor: { title: LText; body: LText; href?: string }[];
  /** 组合页额外列出的基准。场景榜本身不重复挂。 */
  citations?: { kind: "benchmark"; slug: string }[];
  updatedAt: string;
}

export interface ChangeEntry {
  date: string;
  kind: ChangeKind;
  text: LText;
  source: string;
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    scenarios: string;
    models: string;
    tools: string;
    builds: string;
    benchmarks: string;
    search: string;
    theme: string;
    primary: string;
  };
  home: {
    heroTitle: string;
    heroBody: string;
    boards: string;
    viewMore: string;
    toolbox: string;
    allCategories: string;
    changes: string;
    allChanges: string;
    rss: string;
    sources: string;
    sourcesNote: string;
    retired: string;
    stale: string;
  };
  scenario: {
    combo: string;
    viewCombo: string;
    board: string;
    picks: string;
    filterAll: string;
    filterClosed: string;
    filterOpen: string;
    colRank: string;
    colSpread: string;
    colModel: string;
    colScore: string;
    colPass: string;
    colCi: string;
    colVotes: string;
    colPrice: string;
    colRunCost: string;
    colContext: string;
    colAgent: string;
    colEffort: string;
    colAccuracy: string;
    colRelease: string;
    colOrg: string;
    colAgentOrg: string;
    colModelOrg: string;
    colTokens: string;
    colCompletion: string;
    colLatency: string;
    colCost: string;
    showAll: string;
    showLess: string;
    preliminary: string;
    rankNote: string;
    colComposite: string;
    colAppears: string;
    sortBy: string;
    compositeTipAll: string;
    compositeTipPartial: string;
    explain: string;
    why: string;
    others: string;
    staleBanner: string;
    partial: string;
    leadNote: string;
    empty: string;
    synced: string;
    scoringMethod: string;
    scoringClose: string;
    scoringTitle: string;
    scoringToc: string;
    scoringWhyTitle: string;
    scoringIntro: string;
    scoringNormalizeTitle: string;
    scoringNormalizeBody: string;
    scoringWeightsTitle: string;
    scoringWeightsBody: string;
    scoringMissingTitle: string;
    scoringMissingBody: string;
    scoringFormula: string;
    scoringCaveatsTitle: string;
    scoringExampleLegend: string;
    scoringWeight: string;
  };
  model: {
    scores: string;
    scoresNote: string;
    colBench: string;
    colSetting: string;
    colScore: string;
    colRank: string;
    colCost: string;
    colDate: string;
    missing: string;
    retired: string;
    choose: string;
    why: string;
    whyNot: string;
    appears: string;
    appearsNote: string;
    inBuilds: string;
    peers: string;
    current: string;
    perMillion: string;
    agents: string;
    fetched: string;
    asPick: string;
    rank: string;
  };
  tools: {
    how: string;
    inBuilds: string;
    others: string;
    fit: string;
    updated: string;
    indexTitle: string;
    indexBody: string;
    empty: string;
  };
  item: {
    why: string;
    whyPick: string;
    whenNot: string;
    caveat: string;
    install: string;
    snippet: string;
    peers: string;
    alike: string;
    inBuilds: string;
    does: string;
    compat: string;
    together: string;
    appears: string;
    source: string;
    asRole: string;
    related: string;
    categories: string;
    evalBoard: string;
    evalUplift: string;
    evalBaseline: string;
    evalDelta: string;
    evalCost: string;
    evalUnverified: string;
  };
  build: {
    indexTitle: string;
    indexBody: string;
    colRole: string;
    colPrimary: string;
    colAlt: string;
    take: string;
    copy: string;
    copied: string;
    download: string;
    notFor: string;
    evidence: string;
    value: string;
    open: string;
    edited: string;
    modelBasis: string;
    scenario: string;
    category: string;
    withheld: string;
  };
  benchmark: {
    indexTitle: string;
    indexBody: string;
    measures: string;
    method: string;
    meaning: string;
    caveats: string;
    cadence: string;
    source: string;
    usedBy: string;
    stale: string;
    version: string;
    archived: string;
    board: string;
  };
  changes: {
    title: string;
    body: string;
    all: string;
  };
  lists: {
    scenariosTitle: string;
    scenariosBody: string;
    modelsTitle: string;
    modelsBody: string;
    buildsTitle: string;
  };
  footer: { method: string; sources: string; changes: string; suggest: string; legal: string };
  search: { title: string; placeholder: string; empty: string; close: string };
  kind: Record<ChangeKind, string>;
  type: Record<ItemType, string>;
  notFound: { title: string; body: string; home: string };
}
