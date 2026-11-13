import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { getHome, getScenario } from "@/lib/catalog";
import { computeComposite, explainCompositeScore, normalizeToLeader, type CompositeBoardSpec } from "@/lib/composite";

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
    expect(normalizeToLeader("arena", 1811, 1811)).toBeCloseTo(100, 5);
    expect(normalizeToLeader("arena", 1780, 1811)).toBeCloseTo(91.1, 1);
    expect(normalizeToLeader("rate", 32.7, 32.7)).toBe(100);
    expect(normalizeToLeader("rate", 28.0, 32.7)).toBeCloseTo(85.6, 1);
  });

  it("matches the doc top-5 for Web frontend", () => {
    const all = computeComposite(scenarioBoards("web-frontend"));
    const rows = all.slice(0, 5);
    // Web top-5 after FrontierCode 2.0 (weight 0.6, rate → ratio to leader)
    console.log("Web top-5 composite:", rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display]));
    expect(rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-opus-5-5", 95],
      [2, "claude-sonnet-5-5", 88],
      [3, "claude-fable-5-2", 87],
      [4, "gpt-6-astra", 84],
      [5, "claude-fable-5-1", 79],
    ]);
    expect(all.find((row) => row.key === "model:claude-fable-5-2")?.homeEligible).toBe(false);
    expect(all.some((row) => row.key.toLowerCase().includes("ernie"))).toBe(false);
    expect(rows[0]?.cells.map((cell) => cell ? [cell.rank, Math.round(cell.normalized)] : null)).toEqual([
      [2, 93],
      [1, 100],
      [1, 100],
      [1, 100],
      [3, 88],
      null,
      [2, 97],
    ]);
    expect(rows[3]?.coverage).toBeCloseTo(3.8 / 4.2, 5);
    expect(all.find((row) => row.key === "model:gemini-4-argon")?.homeEligible).toBe(true);
  });

  it("matches the doc top-5 for Android with sudo L7, DeepSWE, and FrontierCode", () => {
    const rows = computeComposite(scenarioBoards("android-app")).slice(0, 5);
    console.log("Android top-5 composite:", rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display]));
    expect(rows.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-sonnet-5-5", 94],
      [2, "claude-opus-5-5", 92],
      [3, "gpt-6-astra", 79],
      [4, "gpt-6-1-sol", 75],
      [5, "gpt-6-1-terra", 65],
    ]);
    expect(rows[0]?.cells.map((cell) => cell ? [cell.rank, Math.round(cell.normalized)] : null)).toEqual([
      [1, 100],
      [2, 97],
      null,
      [4, 88],
    ]);
  });

  it("matches the doc top-5 for CLI with DeepSWE and FrontierCode", () => {
    const cli = computeComposite(scenarioBoards("cli-devops")).slice(0, 5);
    expect(cli.map((row) => [row.rank, row.key.replace(/^model:/, ""), row.display])).toEqual([
      [1, "claude-opus-5-5", 96],
      [2, "gpt-6-astra", 93],
      [3, "claude-sonnet-5-5", 91],
      [4, "gpt-6-1-sol", 87],
      [5, "claude-fable-5-1", 82],
    ]);
  });

  it("blends Slop Index (rate, 1.0) with Creative Writing Elo (arena, 0.6)", () => {
    const boards = scenarioBoards("write-docs");
    expect(boards.map((board) => [board.id, board.kind, board.weight])).toEqual([
      ["slop-index", "rate", 1],
      ["eqbench-creative-writing", "arena", 0.6],
    ]);
    const rows = computeComposite(boards);
    expect(rows.slice(0, 3).map((row) => [row.rank, row.key.replace(/^(model:|label:)/, ""), row.display])).toEqual([
      [1, "glm-5-3", 87],
      [2, "gpt-6-sol", 86],
      [2, "claude-fable-5-1", 86],
    ]);
    const astra = rows.find((row) => row.key === "model:gpt-6-astra")!;
    expect(astra.homeEligible).toBe(true);
    expect(astra.cells[0]?.rank).toBe(43);
    expect(astra.cells[1]?.rank).toBe(1);
    const luna = rows.find((row) => row.key === "model:gpt-5-6-luna")!;
    expect(luna.cells[0]?.rank).toBe(19);
    expect(luna.display).toBeLessThan(astra.display);
    const haiku = rows.find((row) => row.key === "model:claude-haiku-5-5")!;
    expect(haiku.cells[0]?.rank).toBe(3);
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

  it("worked example contributions sum to the displayed composite", () => {
    for (const slug of ["web-frontend", "android-app", "cli-devops", "write-docs"] as const) {
      for (const locale of ["zh", "en"] as const) {
        const worked = getScenario(locale, slug)?.scoring.worked;
        expect(worked, `${slug}/${locale}`).toBeDefined();
        const numerator = worked!.rows.reduce((sum, row) => sum + row.contribution, 0);
        const denominator = worked!.rows.reduce((sum, row) => sum + row.weight, 0);
        expect(numerator).toBeCloseTo(worked!.numerator, 8);
        expect(denominator).toBeCloseTo(worked!.denominator, 8);
        expect(numerator / denominator).toBeCloseTo(worked!.score, 8);
        expect(Math.round(numerator / denominator)).toBe(worked!.composite);
        const explained = explainCompositeScore(scenarioBoards(slug), worked!.key);
        expect(explained?.display).toBe(worked!.composite);
        expect(explained?.score).toBeCloseTo(worked!.score, 8);
      }
    }
    const web = getScenario("zh", "web-frontend")!.scoring.worked!;
    expect(web).toMatchObject({ key: "model:claude-fable-5-2", composite: 87 });
    expect(Math.round(web.numerator / web.denominator)).toBe(87);
  });

  it("wires composite into fused tables and home cards", () => {
    const web = getScenario("zh", "web-frontend");
    expect(web?.fusion.rows[0]).toMatchObject({ slug: "claude-opus-5-5", compositeLabel: "95" });
    expect(web?.fusion.rows.map((row) => row.slug).slice(0, 5)).toEqual([
      "claude-opus-5-5",
      "claude-sonnet-5-5",
      "claude-fable-5-2",
      "gpt-6-astra",
      "claude-fable-5-1",
    ]);
    expect(web?.fusion.rows.find((row) => row.slug === "claude-opus-5-5")?.cells.map((cell) => cell?.rank ?? null)).toEqual([
      2, 1, 3, null, 2, 1, 1,
    ]);

    const home = getHome("zh").cards;
    expect(home[0]?.rows.map((row) => [row.name, row.score])).toEqual([
      ["Claude Opus 5.5", "95"],
      ["Claude Sonnet 5.5", "88"],
      ["GPT-6 Astra", "84"],
      ["Claude Fable 5.1", "79"],
      ["GPT-6.1 Sol", "78"],
    ]);
    expect(home[0]?.rows[0]?.detail?.boards.map((board) => board.value)).toEqual([
      "#2 · 93",
      "#1 · 100",
      "#3 · 88",
      "—",
      "#2 · 97",
      "#1 · 100",
      "#1 · 100",
    ]);

    expect(home[0]?.rows.every((row) => !("boards" in row && row.boards))).toBe(true);
    expect(home[1]?.rows.map((row) => [row.name, row.score])).toEqual([
      ["Claude Sonnet 5.5", "94"],
      ["Claude Opus 5.5", "92"],
      ["GPT-6 Astra", "79"],
      ["GPT-6.1 Sol", "75"],
      ["Claude Fable 5.1", "64"],
    ]);
    expect(home[1]?.rows[0]?.unit).toBeUndefined();
    expect(home[1]?.rows[0]?.detail?.boards.map((board) => board.value)).toEqual(["#1 · 100", "#2 · 97", "—", "#4 · 88"]);
    expect(home[2]?.rows.map((row) => row.score)).toEqual(["96", "93", "91", "87", "82"]);
    expect(home[3]?.rows[0]).toMatchObject({ name: "GLM-5.3", score: "87" });
    expect(home[3]?.rows.map((row) => [row.name, row.score]).slice(0, 3)).toEqual([
      ["GLM-5.3", "87"],
      ["GPT 6 Sol", "86"],
      ["Claude Fable 5.1", "86"],
    ]);
    expect(home).toHaveLength(4);
  });
});
