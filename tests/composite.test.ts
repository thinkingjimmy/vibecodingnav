import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { getHome, getScenario } from "@/lib/catalog";
import { computeComposite, normalizeToLeader, type CompositeBoardSpec } from "@/lib/composite";

function bestRows(benchmark: string): CompositeBoardSpec["rows"] {
  const current = content.benchmarks.find((item) => item.slug === benchmark)?.versions?.find((version) => version.current)?.id;
  const map = new Map<string, CompositeBoardSpec["rows"][number]>();
  for (const row of content.results) {
    if (row.benchmark !== benchmark || (row.arm ?? "baseline") !== "baseline" || row.rank == null) continue;
    if (current ? row.version !== current : row.version) continue;
    const key = row.modelSlug ? `model:${row.modelSlug}` : `label:${row.label ?? ""}`;
    const prev = map.get(key);
    if (!prev || row.rank < prev.rank || (row.rank === prev.rank && row.score > prev.score)) {
      map.set(key, { key, rank: row.rank, score: row.score, preliminary: row.preliminary });
    }
  }
  return [...map.values()];
}

function scenarioBoards(slug: string): CompositeBoardSpec[] {
  const scenario = content.scenarios.find((item) => item.slug === slug)!;
  const specs = scenario.boards?.length
    ? scenario.boards
    : scenario.benchmark
      ? [{ id: scenario.benchmark, benchmark: scenario.benchmark, weight: 1 }]
      : [];
  return specs.map((spec) => {
    const benchmark = content.benchmarks.find((item) => item.slug === spec.benchmark)!;
    return {
      id: spec.benchmark,
      kind: benchmark.compositeKind,
      weight: spec.weight ?? 1,
      rows: bestRows(spec.benchmark),
    };
  });
}

describe("composite method C", () => {
  it("normalizes arena boards by win probability and rate boards by leader ratio", () => {
    expect(normalizeToLeader("arena", 1813, 1813)).toBeCloseTo(100, 5);
    expect(normalizeToLeader("arena", 1786, 1813)).toBeCloseTo(92.2, 1);
    expect(normalizeToLeader("rate", 32.7, 32.7)).toBe(100);
    expect(normalizeToLeader("rate", 28.0, 32.7)).toBeCloseTo(85.6, 1);
  });

  it("matches the doc top-5 for Web frontend", () => {
    const all = computeComposite(scenarioBoards("web-frontend"));
    const rows = all.slice(0, 5);
    // New Web top-5 after adding sudo L7 (weight 0.6, rate → ratio to leader)
    console.log("Web top-5 composite:", rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display]));
    expect(rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-opus-5-5", 98],
      [2, "claude-sonnet-5-5", 92],
      [3, "gpt-6-astra", 87],
      [4, "claude-fable-5-1", 84],
      [5, "gpt-6-1-sol", 80],
    ]);
    expect(rows[0]?.cells.map((cell) => cell ? [cell.rank, Math.round(cell.normalized)] : null)).toEqual([
      [1, 100],
      [1, 100],
      [1, 100],
      null,
      [1, 100],
    ]);
    expect(rows[3]?.coverage).toBe(1);
    expect(all.find((row) => row.key === "model:gemini-4-argon")?.homeEligible).toBe(false);
  });

  it("matches the doc top-5 for single-board scenarios", () => {
    expect(computeComposite(scenarioBoards("android-app")).slice(0, 5).map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-opus-5-5", 100],
      [2, "gpt-6-astra", 86],
      [3, "claude-fable-5-1", 69],
      [4, "gpt-6-sol", 55],
      [5, "qwen3-8-max", 43],
    ]);

    const cli = computeComposite(scenarioBoards("cli-devops")).slice(0, 5);
    expect(cli.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-opus-5-5", 100],
      [2, "claude-sonnet-5-5", 95],
      [3, "gpt-6-1-sol", 90],
      [3, "gpt-6-astra", 90],
      [5, "claude-fable-5-1", 89],
    ]);
    expect(cli[2]?.tie).toBe(true);
    expect(cli[3]?.tie).toBe(true);
  });

  it("halves weight for preliminary rows and missing boards", () => {
    const boards: CompositeBoardSpec[] = [
      {
        id: "primary",
        kind: "rate",
        weight: 1,
        rows: [
          { key: "model:a", rank: 1, score: 100 },
          { key: "model:b", rank: 2, score: 50, preliminary: true },
          { key: "model:c", rank: 3, score: 50 },
        ],
      },
      {
        id: "secondary",
        kind: "rate",
        weight: 1,
        rows: [
          { key: "model:a", rank: 1, score: 100 },
          { key: "model:c", rank: 2, score: 50 },
        ],
      },
    ];
    const rows = computeComposite(boards);
    const a = rows.find((row) => row.key === "model:a")!;
    const b = rows.find((row) => row.key === "model:b")!;
    const c = rows.find((row) => row.key === "model:c")!;
    expect(a.display).toBe(100);
    expect(b.coverage).toBe(0.5);
    // b: half-weight 50 on primary + half-weight median prior on secondary → pulled above the raw 50
    expect(b.score).toBeGreaterThan(50);
    // c appears on both boards at 50; without preliminary it stays 50
    expect(c.display).toBe(50);
    expect(b.homeEligible).toBe(true);
  });

  it("wires composite into fused tables and home cards", () => {
    const web = getScenario("zh", "web-frontend");
    expect(web?.fusion.rows[0]).toMatchObject({ slug: "claude-opus-5-5", compositeLabel: "98" });
    expect(web?.fusion.rows.map((row) => row.slug).slice(0, 5)).toEqual([
      "claude-opus-5-5",
      "claude-sonnet-5-5",
      "gpt-6-astra",
      "claude-fable-5-1",
      "gpt-6-1-sol",
    ]);
    expect(web?.fusion.rows.find((row) => row.slug === "claude-opus-5-5")?.cells.map((cell) => cell?.rank ?? null)).toEqual([1, 1, 1, null, 1]);

    const home = getHome("zh").cards;
    expect(home[0]?.rows.map((row) => [row.name, row.score])).toEqual([
      ["Claude Opus 5.5", "98"],
      ["Claude Sonnet 5.5", "92"],
      ["GPT-6 Astra", "87"],
      ["Claude Fable 5.1", "84"],
      ["GPT-6.1 Sol", "80"],
    ]);
    expect(home[0]?.rows[0]?.detail?.boards.map((board) => board.value)).toEqual(["#1 · 100", "#1 · 100", "#1 · 100", "—", "#1 · 100"]);
    expect(home[0]?.rows.every((row) => !("boards" in row && row.boards))).toBe(true);
    expect(home[1]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", score: "100" });
    expect(home[1]?.rows[0]?.unit).toBeUndefined();
    expect(home[2]?.rows.map((row) => row.score)).toEqual(["100", "95", "90", "90", "89"]);
    expect(home).toHaveLength(3);
  });
});
