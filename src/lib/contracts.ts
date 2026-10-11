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

export interface ScenarioBoard {
  id: string;
  benchmark: string;
  label: LText;
}

export interface Scenario {
  slug: string;
  title: LText;
  summary: LText;
  /** 首页卡片、挑选和组合使用的那一张来源榜。 */
  benchmark?: string;
  /** 同一场景里的多张来源表。顺序即列顺序。多版本基准只放当前版本。 */
  boards?: ScenarioBoard[];
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
    fusedNote: string;
    colAvg: string;
    colAppears: string;
    sortBy: string;
    explain: string;
    why: string;
    others: string;
    staleBanner: string;
    partial: string;
    leadNote: string;
    empty: string;
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
