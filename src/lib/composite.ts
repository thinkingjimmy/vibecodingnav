/**
 * [INPUT]: 依赖场景各榜的基线臂最好一行（名次、分数、是否初步）与榜种 / 权重
 * [OUTPUT]: 对外提供方法 C 综合分：相对榜首归一化、加权、缺榜半权中位收缩、并列与首页门槛；以及单模型逐步拆解
 * [POS]: src/lib 的纯函数评分；catalog 在构建期调用，页面不重算
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export type CompositeKind = "arena" | "rate";

export interface CompositeBoardRow {
  key: string;
  rank: number;
  score: number;
  preliminary?: boolean;
}

export interface CompositeBoardSpec {
  id: string;
  kind: CompositeKind;
  weight: number;
  rows: CompositeBoardRow[];
}

export interface CompositeCell {
  normalized: number;
  rank: number;
  score: number;
  preliminary: boolean;
}

export interface CompositeScore {
  key: string;
  /** 未四舍五入的综合分。 */
  score: number;
  /** 展示用整数分（四舍五入）。 */
  display: number;
  rank: number;
  tie: boolean;
  coverage: number;
  homeEligible: boolean;
  primaryRank: number;
  primaryScore: number;
  cells: (CompositeCell | null)[];
}

/** 单榜对综合分的贡献（与 computeComposite 同一套权重 / 缺榜规则）。 */
export interface CompositeBoardContribution {
  id: string;
  kind: CompositeKind;
  baseWeight: number;
  effectiveWeight: number;
  normalized: number;
  contribution: number;
  missing: boolean;
  preliminary: boolean;
  rank: number | null;
  score: number | null;
}

export interface CompositeExplanation {
  key: string;
  numerator: number;
  denominator: number;
  score: number;
  display: number;
  boards: CompositeBoardContribution[];
}

const MISSING_WEIGHT = 0.5;
const HOME_COVERAGE = 0.5;

type PreparedBoard = CompositeBoardSpec & {
  best: Map<string, CompositeBoardRow>;
  norms: Map<string, number>;
  prior: number;
};

function bestRows(rows: CompositeBoardRow[]) {
  const map = new Map<string, CompositeBoardRow>();
  for (const row of rows) {
    const prev = map.get(row.key);
    if (!prev || row.rank < prev.rank || (row.rank === prev.rank && row.score > prev.score)) map.set(row.key, row);
  }
  return map;
}

/** 竞技场：2 × 对榜首预期胜率；通过率：分数 / 榜首。榜首 = 100。 */
export function normalizeToLeader(kind: CompositeKind, score: number, leader: number) {
  if (leader <= 0) return 0;
  if (kind === "arena") return 200 / (1 + 10 ** ((leader - score) / 400));
  return (100 * score) / leader;
}

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function isModelKey(key: string) {
  return !key.startsWith("label:");
}

function prepareBoards(boards: CompositeBoardSpec[]): PreparedBoard[] {
  return boards.map((board) => {
    const best = bestRows(board.rows);
    const leader = Math.max(0, ...[...best.values()].map((row) => row.score));
    const norms = new Map<string, number>();
    for (const [key, row] of best) norms.set(key, normalizeToLeader(board.kind, row.score, leader));
    const prior = median([...norms.entries()].filter(([key]) => isModelKey(key)).map(([, value]) => value));
    return { ...board, best, norms, prior, weight: board.weight };
  });
}

function accumulateKey(prepared: PreparedBoard[], key: string) {
  let num = 0;
  let den = 0;
  let observed = 0;
  const cells: (CompositeCell | null)[] = [];
  const boards: CompositeBoardContribution[] = [];
  for (const board of prepared) {
    const row = board.best.get(key);
    const normalized = board.norms.get(key);
    if (row && normalized != null) {
      const weight = board.weight * (row.preliminary ? 0.5 : 1);
      num += weight * normalized;
      den += weight;
      observed += board.weight;
      cells.push({
        normalized,
        rank: row.rank,
        score: row.score,
        preliminary: Boolean(row.preliminary),
      });
      boards.push({
        id: board.id,
        kind: board.kind,
        baseWeight: board.weight,
        effectiveWeight: weight,
        normalized,
        contribution: weight * normalized,
        missing: false,
        preliminary: Boolean(row.preliminary),
        rank: row.rank,
        score: row.score,
      });
    } else {
      const weight = MISSING_WEIGHT * board.weight;
      num += weight * board.prior;
      den += weight;
      cells.push(null);
      boards.push({
        id: board.id,
        kind: board.kind,
        baseWeight: board.weight,
        effectiveWeight: weight,
        normalized: board.prior,
        contribution: weight * board.prior,
        missing: true,
        preliminary: false,
        rank: null,
        score: null,
      });
    }
  }
  const score = den ? num / den : 0;
  return { num, den, observed, score, cells, boards };
}

/**
 * 方法 C：相对榜首 · 加权 · 缺榜按中位半权收缩。
 * 只给出现在主榜（第一张）上的模型打分；排序键为四舍五入后的综合分、主榜名次、覆盖率、key。
 */
export function computeComposite(boards: CompositeBoardSpec[]): CompositeScore[] {
  if (!boards.length) return [];
  const prepared = prepareBoards(boards);
  const primary = prepared[0]!;
  const totalWeight = prepared.reduce((sum, board) => sum + board.weight, 0) || 1;
  const out: Omit<CompositeScore, "rank" | "tie" | "display">[] = [];

  for (const key of primary.best.keys()) {
    const { observed, score, cells } = accumulateKey(prepared, key);
    const coverage = observed / totalWeight;
    const primaryRow = primary.best.get(key)!;
    out.push({
      key,
      score,
      coverage,
      homeEligible: isModelKey(key) && coverage + 1e-12 >= HOME_COVERAGE,
      primaryRank: primaryRow.rank,
      primaryScore: primaryRow.score,
      cells,
    });
  }

  out.sort((a, b) =>
    Math.round(b.score) - Math.round(a.score)
    || a.primaryRank - b.primaryRank
    || b.coverage - a.coverage
    || a.key.localeCompare(b.key));

  const ranked: CompositeScore[] = [];
  let prevRounded: number | null = null;
  for (let index = 0; index < out.length; index++) {
    const row = out[index]!;
    const display = Math.round(row.score);
    const tie = prevRounded === display;
    const rank = tie ? ranked[index - 1]!.rank : index + 1;
    ranked.push({ ...row, display, rank, tie });
    prevRounded = display;
  }
  for (let index = 0; index < ranked.length - 1; index++) {
    if (ranked[index + 1]!.tie) ranked[index] = { ...ranked[index]!, tie: true };
  }
  return ranked;
}

/** 与 computeComposite 同一路径，拆开某一模型的分子 / 分母与各榜贡献。 */
export function explainCompositeScore(boards: CompositeBoardSpec[], key: string): CompositeExplanation | undefined {
  if (!boards.length) return undefined;
  const prepared = prepareBoards(boards);
  if (!prepared[0]!.best.has(key)) return undefined;
  const { num, den, score, boards: contrib } = accumulateKey(prepared, key);
  return {
    key,
    numerator: num,
    denominator: den,
    score,
    display: Math.round(score),
    boards: contrib,
  };
}
