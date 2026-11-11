/**
 * [INPUT]: Aligned scenario results from catalog and vendor identifiers.
 * [OUTPUT]: Comparison series, relative ranks, curve paths, and chart dimensions.
 * [POS]: Layout helpers used only by the scenario comparison chart.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import type { fuseScenario } from "@/lib/catalog";
import type { VendorId } from "@/lib/contracts";

export type Fusion = ReturnType<typeof fuseScenario>;
export type FusionRow = Fusion["rows"][number];
export const COLUMN_WIDTH = 132;
export const ROW_HEIGHT = 34;
export const TOP = 24;

export interface RankPoint {
  x: number;
  y: number;
  rank: number;
  sourceRank: number;
}

export interface RankSeries {
  row: FusionRow;
  labelY: number;
  featured: boolean;
  points: (RankPoint | null)[];
  path: string;
}

export function curvePath(points: (RankPoint | null)[]) {
  let previous: RankPoint | null = null;
  return points.map((point) => {
    if (!point) {
      previous = null;
      return "";
    }
    const command = previous
      ? `C ${(previous.x + point.x) / 2} ${previous.y}, ${(previous.x + point.x) / 2} ${point.y}, ${point.x} ${point.y}`
      : `M ${point.x} ${point.y}`;
    previous = point;
    return command;
  }).join(" ");
}

export function comparisonSeries(rows: FusionRow[], columnCount: number): RankSeries[] {
  const layouts = Array.from({ length: columnCount }, (_, column) => {
    const present = rows.filter((row) => row.cells[column]).sort((a, b) => a.cells[column]!.rank - b.cells[column]!.rank);
    return new Map(present.map((row) => {
      const sourceRank = row.cells[column]!.rank;
      const first = present.findIndex((other) => other.cells[column]!.rank === sourceRank);
      const tied = present.filter((other) => other.cells[column]!.rank === sourceRank);
      const offset = tied.findIndex((other) => other.key === row.key) - (tied.length - 1) / 2;
      return [row.key, {
        x: COLUMN_WIDTH * (column + 0.5) + offset * Math.min(22, 72 / tied.length),
        y: TOP + (first + (tied.length - 1) / 2) * ROW_HEIGHT,
        rank: first + 1,
        sourceRank,
      }];
    }));
  });
  const labelOrder = [...rows].sort((a, b) => (a.cells[0]?.rank ?? Infinity) - (b.cells[0]?.rank ?? Infinity));
  return rows.map((row, index) => {
    const points = layouts.map((layout) => layout.get(row.key) ?? null);
    return {
      row,
      labelY: TOP + labelOrder.findIndex((other) => other.key === row.key) * ROW_HEIGHT,
      featured: index < 5,
      points,
      path: curvePath(points),
    };
  });
}

export function seriesColor(vendor?: VendorId) {
  const colors: Partial<Record<VendorId, string>> = {
    anthropic: "var(--rank-clay)",
    openai: "var(--rank-ink)",
    google: "var(--rank-green)",
    meta: "var(--rank-blue)",
    kimi: "var(--rank-blue)",
    deepseek: "var(--rank-indigo)",
    qwen: "var(--rank-orange)",
    xai: "var(--rank-purple)",
    zhipu: "var(--rank-blue)",
  };
  return (vendor && colors[vendor]) || "var(--rank-purple)";
}
