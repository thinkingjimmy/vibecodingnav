import { describe, expect, it } from "vitest";
import { LOBE_VENDORS } from "@/components/vendor-mark";
import { content } from "@/content";
import { validateContent } from "@/content/validate";
import { getBenchmark, getBuild, getHome, getItem, getModel, getScenario, listScenarioCards, resolvePicks } from "@/lib/catalog";
import { daysBetween, isStale } from "@/lib/site";
import { localePath, swapLocale } from "@/lib/locale";

describe("vendor marks", () => {
  it("gives every seeded vendor a LobeHub mono mark", () => {
    const used = [...new Set(content.models.map((model) => model.vendor))];
    expect(used.filter((vendor) => !LOBE_VENDORS.includes(vendor))).toEqual([]);
  });
});

describe("content", () => {
  it("accepts the seed bundle", () => {
    expect(validateContent(content)).toEqual([]);
  });

  it("rejects a duplicate model slug", () => {
    const broken = { ...content, models: [content.models[0], ...content.models] };
    expect(validateContent(broken).some((error) => error.includes("重复"))).toBe(true);
  });

  it("requires exactly one current benchmark version", () => {
    const benchmarks = content.benchmarks.map((benchmark) => benchmark.slug === "android-bench" && benchmark.versions
      ? { ...benchmark, versions: benchmark.versions.map((version) => ({ ...version, current: true, archived: false })) }
      : benchmark);
    expect(validateContent({ ...content, benchmarks }).some((error) => error.includes("当前版本"))).toBe(true);
  });

  it("rejects a benchmark used by two scenarios", () => {
    const donor = content.scenarios[0]!;
    const extra = { ...donor, slug: "duplicate-board", related: [], build: undefined, boards: undefined };
    const errors = validateContent({ ...content, scenarios: [...content.scenarios, extra] });
    expect(errors.some((error) => error.includes(donor.benchmark!) && error.includes("duplicate-board"))).toBe(true);
  });
});

describe("stale clock", () => {
  it("treats exactly 90 days as still current", () => {
    expect(daysBetween("2026-07-12", "2026-10-10")).toBe(90);
    expect(isStale("2026-07-12", "2026-10-10")).toBe(false);
    expect(isStale("2026-07-11", "2026-10-10")).toBe(true);
  });

  it("marks retired boards stale and keeps the October boards current", () => {
    expect(getBenchmark("zh", "swe-bench-verified")?.stale).toBe(true);
    expect(getBenchmark("zh", "aider-polyglot")?.stale).toBe(true);
    expect(getBenchmark("zh", "lmarena-webdev")?.stale).toBe(false);
    expect(getBenchmark("zh", "android-bench")?.stale).toBe(false);
  });
});

describe("picks", () => {
  it("resolves the web frontend board", () => {
    const picks = resolvePicks("web-frontend");
    expect(picks.top?.modelSlug).toBe("claude-opus-5-5");
    expect(picks.top?.score).toBe(1813);
    expect(picks.value?.modelSlug).toBe("claude-sonnet-5-5");
    expect(picks.value?.score).toBe(1774);
    expect(picks.open?.modelSlug).toBe("mimo-v2-6-flash");
  });

  it("resolves cheaper terminal and android rows", () => {
    expect(resolvePicks("cli-devops").value?.modelSlug).toBe("gpt-6-1-sol");
    expect(resolvePicks("cli-devops").open?.modelSlug).toBe("glm-5-3");
    expect(resolvePicks("android-app").top?.modelSlug).toBe("claude-opus-5-5");
    expect(resolvePicks("android-app").value?.modelSlug).toBe("gpt-6-sol");
  });

  it("keeps sudo L7 on the Web frontend scenario", () => {
    expect(getScenario("zh", "production-changes")).toBeUndefined();
    expect(getBenchmark("zh", "sudo-l7")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("en", "sudo-l7")?.links.map((link) => link.href)).toEqual([
      "https://surgehq.ai/benchmarks/sudo-l7",
      "https://surgehq.ai/blog/sudo-l7",
    ]);
    expect(getBenchmark("zh", "sudo-l7")?.leaderboard?.map((row) => [row.name, row.scoreNumber])).toEqual([
      ["Claude Opus 5.5", 45],
      ["Claude Sonnet 5.5", 45],
      ["GPT 6 Astra", 32.2],
      ["GPT 6.1 Sol", 31.7],
      ["Claude Fable 5.1", 27.2],
      ["Qwen 3.8 Max", 15.6],
      ["GLM 5.3", 15],
      ["Kimi K3", 13.9],
      ["Muse Spark 1.3", 12.2],
      ["Hy4 Preview", 11.1],
      ["Grok 4.7", 10.6],
      ["Gemini 3.8 Flash", 10.6],
    ]);
    expect(getModel("en", "claude-sonnet-5-5")?.appearances.some((row) => row.href === "/scenarios/web-frontend/")).toBe(true);
    expect(getModel("zh", "gemini-3-8-flash")?.scoreRows.some((row) => row.name === "sudo L7" && row.score === "10.6")).toBe(true);
  });

  it("keeps one board per scenario on the home page and the scenario list", () => {
    const home = getHome("zh").cards.map((card) => card.title);
    const all = listScenarioCards("zh").map((card) => card.title);
    expect(home).toEqual([
      "做 Web 前端",
      "做一个 Android App",
      "写 CLI、脚本与 DevOps",
    ]);
    expect(all).toEqual(home);
    expect(getScenario("zh", "refactor")).toBeUndefined();
    expect(getScenario("zh", "open-frontend")).toBeUndefined();
    expect(getScenario("zh", "saas")).toBeUndefined();
    expect(getScenario("zh", "ios-app")).toBeUndefined();
    expect(getScenario("zh", "production-changes")).toBeUndefined();
    expect(getBenchmark("zh", "terminal-bench-4")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/cli-devops/"]);
    const saas = getBuild("zh", "saas");
    expect(saas?.roles[0]?.primary.name).toBe("GPT-6.1 Sol");
    expect(saas?.evidence.map((link) => link.href)).toEqual(expect.arrayContaining([
      "/zh/scenarios/cli-devops/",
      "/zh/benchmarks/nextjs-evals/",
      "/zh/benchmarks/supabase-evals/",
      "/zh/benchmarks/convex-evals/",
      "/zh/benchmarks/reactbench/",
    ]));
  });

  it("keeps each public board complete and in source order", () => {
    const web = getScenario("zh", "web-frontend");
    expect(web?.boards[0]?.rows).toHaveLength(142);
    expect(web?.boards[0]?.rows[0]).toMatchObject({ name: "claude-opus-5.5-max", rank: 1, score: "1813" });
    expect(web?.boards[0]?.rows[15]).toMatchObject({ name: "mimo-v2.6-flash", rank: 16, score: "1637" });
    expect(web?.boards[0]?.rows[21]).toMatchObject({ name: "glm-5.3-max", rank: 22, score: "1622" });
    expect(web?.rows.some((row) => row.price === "$0.6k")).toBe(false);

    const android = getScenario("zh", "android-app");
    expect(android?.boards.map((board) => [board.id, board.rows.length])).toEqual([["current", 10]]);
    expect(android?.boards[0]?.rows.map((row) => [row.rank, row.name, row.agent, row.score, row.ci, row.completion, row.latency, row.price])).toEqual([
      [1, "Claude Opus 5.5", "claude-code", "32.7", "18.7–47.3", "84.7", "15.2", "$215.4"],
      [2, "GPT 6 Astra", "codex", "28.0", "13.3–42.0", "82.2", "7.9", "$375.7"],
      [3, "Claude Fable 5.1", "claude-code", "22.7", "10.7–36.0", "82.4", "22.2", "$492.6"],
      [4, "GPT 6 Sol", "codex", "18.0", "7.3–29.3", "70.2", "6.0", "$93.4"],
      [5, "Qwen3.8 Max", "qwen-coder", "14.0", "4.7–24.0", "74.3", "47.2", "$260.2"],
      [6, "Kimi K3", "kimi-code", "12.0", "3.3–22.0", "72.8", "66.2", "$418.3"],
      [7, "GPT 6 Luna", "codex", "10.7", "4.0–17.3", "53.2", "6.2", "$5.3"],
      [8, "Gemini 3.8 Flash", "antigravity-sdk", "8.0", "3.3–13.3", "47.4", "12.1", "$34.5"],
      [9, "Gemini 3.7 Flash", "antigravity-sdk", "7.3", "1.3–14.7", "50.1", "9.9", "$26.0"],
      [10, "Claude Sonnet 5", "claude-code", "6.7", "1.3–13.3", "59.8", "14.7", "$283.7"],
    ]);
    const archived = getBenchmark("zh", "android-bench")?.versions?.find((version) => version.id === "1.0");
    expect(archived?.archived).toBe(true);
    expect(archived?.leaderboard).toHaveLength(32);
    expect(archived?.leaderboard?.[0]).toMatchObject({ name: "Claude Opus 5", score: "91.8", ci: "87.4–95.7", latency: "13.2", price: "$175.4" });
    expect(archived?.leaderboard?.[31]).toMatchObject({ name: "Qwen3.6 35b A3b", score: "37.0", weights: "open" });

    const terminal = getScenario("zh", "cli-devops")?.boards[0]?.rows ?? [];
    expect(terminal).toHaveLength(35);
    expect(terminal[3]).toMatchObject({ name: "GPT-6.1 Sol", rank: 3, score: "58.2% ± 3.1%", price: "$634.24" });
    expect(terminal[20]).toMatchObject({ name: "Grok 4.7", rank: 21, price: "$3.68k (partial: 324/330)" });
    expect(getBenchmark("zh", "lmarena-webdev")?.leaderboard).toHaveLength(142);
    const androidBench = getBenchmark("zh", "android-bench");
    expect(androidBench?.versions?.map((version) => version.id)).toEqual(["2.0", "1.0"]);
    expect(androidBench?.versions?.[0]?.current).toBe(true);
    expect(androidBench?.leaderboard).toHaveLength(10);
    expect(androidBench?.leaderboard?.[0]).toMatchObject({ name: "Claude Opus 5.5", agent: "claude-code", score: "32.7" });
    expect(getBenchmark("en", "android-bench")?.versions?.[1]?.label).toBe("1.0");
  });

  it("fuses scenario boards by model and composite score", () => {
    const web = getScenario("zh", "web-frontend");
    expect(web?.fusion.columns.map((column) => column.id)).toEqual(["lmarena-webdev", "lmarena-image-to-webdev", "nextjs-evals", "reactbench", "sudo-l7"]);
    const opus = web?.fusion.rows.find((row) => row.slug === "claude-opus-5-5");
    expect(opus?.cells.map((cell) => cell?.rank ?? null)).toEqual([1, 1, 1, null, 1]);
    expect(opus).toMatchObject({ compositeLabel: "98", count: 4, total: 5 });
    expect(opus?.cells[0]?.tip).toContain("1813");
    expect(opus?.cells[0]?.tip).toContain("claude-opus-5.5-max");
    expect(opus?.cells[0]?.tip).toContain("max");
    const fable = web?.fusion.rows.find((row) => row.slug === "claude-fable-5-1");
    expect(fable?.cells.map((cell) => cell?.rank ?? null)).toEqual([5, 4, 3, 1, 5]);
    expect(fable).toMatchObject({ compositeLabel: "84", count: 5 });
    expect(web?.fusion.rows[0]?.slug).toBe("claude-opus-5-5");
    expect(web?.fusion.rows[1]?.slug).toBe("claude-sonnet-5-5");
    expect(web?.fusion.rows[2]?.slug).toBe("gpt-6-astra");

    const android = getScenario("zh", "android-app");
    expect(android?.fusion.columns.map((column) => [column.id, column.label])).toEqual([["android-bench", "Android Bench 2.0"]]);
    const opus55 = android?.fusion.rows.find((row) => row.slug === "claude-opus-5-5");
    expect(android?.fusion.rows.find((row) => row.slug === "claude-opus-5")).toBeUndefined();
    expect(opus55?.cells.map((cell) => cell?.rank ?? null)).toEqual([1]);
    expect(opus55?.cells[0]?.tip).toContain("claude-code");
    expect(opus55?.cells[0]?.tip).toContain("32.7");
    expect(android?.fusion.rows[0]?.slug).toBe("claude-opus-5-5");
    expect(android?.fusion.rows[0]?.compositeLabel).toBe("100");

    expect(getBenchmark("zh", "supabase-evals")?.scenarios).toEqual([]);
    expect(getBenchmark("zh", "convex-evals")?.scenarios).toEqual([]);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard).toHaveLength(64);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[0]).toMatchObject({ name: "claude-opus-5.5-max", rank: 1, score: "1749", ci: "+30/-30" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[63]).toMatchObject({ name: "gemini-2.5-pro", rank: 64, score: "1285" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.chart?.points).toHaveLength(64);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.chart?.points.filter((point) => point.pareto).map((point) => [point.name, point.priceLabel])).toEqual([
      ["claude-opus-5.5-max", "16"],
      ["claude-sonnet-5.5-xhigh", "8"],
      ["muse-spark-1.3-max", "3.50"],
      ["deepseek-v4.1-flash-max", "0.97"],
      ["mimo-v2.6-flash", "0.25"],
      ["glm-5.3-flash", "0.17"],
    ]);
    expect(getBenchmark("zh", "nextjs-evals")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "reactbench")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "android-bench")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/android-app/"]);
    expect(getBenchmark("zh", "android-bench-1")).toBeUndefined();
    expect(getBenchmark("zh", "android-bench-2-long")).toBeUndefined();

    const home = getHome("zh").cards;
    expect(home[0]?.sources?.map((source) => source.name)).toEqual(["LMArena WebDev", "LMArena Image-to-WebDev", "Next.js Agent Evals", "ReactBench", "sudo L7"]);
    expect(home[0]?.rows).toHaveLength(5);
    expect(home[0]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", rankLabel: "1", score: "98" });
    expect(home[0]?.rows[0]?.detail?.title).toContain("综合 98");
    expect(home[1]?.sources?.map((source) => source.name)).toEqual(["Android Bench"]);
    expect(home[1]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", rankLabel: "1", score: "100" });
    expect(home[2]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", score: "100" });
    expect(home).toHaveLength(3);
  });

  it("keeps framework eval arms as separate scores", () => {
    const board = getItem("zh", "library", "supabase")?.evalView;
    expect(board?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", baseline: "91.3", rank: 1 });
    const uplift = getItem("zh", "skill", "supabase-skills")?.evalView?.rows ?? [];
    expect(uplift.find((row) => row.name === "Claude Opus 5.5")?.delta).toBe("−1.4");
    expect(uplift.find((row) => row.name === "GPT 6 Sol")?.delta).toBe("0");
    expect(uplift.find((row) => row.name === "Grok 4.7")?.delta).toBe("+11.6");

    const convex = getItem("en", "library", "convex")?.evalView;
    expect(convex?.rows[0]).toMatchObject({ baseline: "90.18", web: "96.43" });
    expect(convex?.rows.find((row) => row.name === "Gemini 3.1 Pro Preview")?.web).toBeUndefined();
    expect(getItem("zh", "prompt", "convex-ai-rules")?.evalView?.rows).toEqual([]);
    expect(getItem("zh", "prompt", "convex-ai-rules")?.evalView?.mode).toBe("unverified");

    const next = getItem("en", "prompt", "nextjs-agents-md")?.evalView?.rows ?? [];
    expect(next.find((row) => row.name === "Claude Opus 5.5")?.delta).toBe("0");
    expect(next.find((row) => row.name === "Kimi K3")?.delta).toBe("+13.0");

    const react = getItem("zh", "library", "react")?.evalView;
    expect(react?.kindLabel).toBe("生态评测");
    expect(react?.rows[0]).toMatchObject({ name: "Claude Fable 5.1", rank: 1, baseline: "49.2" });
    expect(react?.rows.some((row) => row.rank === 17)).toBe(false);

    const scores = getModel("zh", "claude-opus-5-5")?.scoreRows.filter((row) => row.name === "Supabase Evals" || row.name === "Convex Evals") ?? [];
    expect(scores.map((row) => row.score)).toEqual(["91.3", "90.18"]);
    expect(getBenchmark("en", "convex-evals")?.version).toBe("92a60e0bb2f156b5ac44e6ea3f5d03a91deb434b9d002d14819d1fc2b6e35cdb");
    expect(getBenchmark("en", "reactbench")?.domain).toBe("Ecosystem eval");
  });
});

describe("backlinks", () => {
  it("connects phosphor and frontend-design to their category and build", () => {
    const phosphor = getItem("zh", "library", "phosphor-icons");
    expect(phosphor?.categories.map((row) => row.href)).toContain("/zh/tools/icons/");
    expect(phosphor?.builds.map((row) => row.href)).toContain("/zh/build/web-frontend/");

    const skill = getItem("zh", "skill", "frontend-design");
    expect(skill?.categories.map((row) => row.href)).toContain("/zh/tools/ui/");
    expect(skill?.builds.map((row) => row.href)).toContain("/zh/build/web-frontend/");
    expect(skill?.scenarios.map((row) => row.href)).toContain("/zh/scenarios/web-frontend/");
  });

  it("links a skill to its library", () => {
    expect(getItem("en", "skill", "gsap-skills")?.related?.href).toBe("/libraries/gsap/");
    expect(getItem("en", "library", "gsap")?.related?.href).toBe("/skills/gsap-skills/");
  });

  it("puts the web build on the leading model", () => {
    const model = getModel("zh", "claude-opus-5-5");
    expect(model?.appearances.some((row) => row.href === "/zh/scenarios/web-frontend/")).toBe(true);
    expect(model?.builds.some((row) => row.href === "/zh/build/web-frontend/")).toBe(true);
  });

  it("renders the web build alternatives from the board", () => {
    const build = getBuild("zh", "web-frontend");
    expect(build?.roles[0]?.primary.name).toBe("Claude Opus 5.5");
    expect(build?.roles[0]?.alternative).toContain("Claude Sonnet 5.5");
    expect(build?.roles[0]?.alternative).toContain("MiMo V2.6 Flash");
    expect(build?.agentsMd).toContain("frontend-design");
  });
});

describe("stale picks", () => {
  it("withholds the android model once the board is past 90 days", () => {
    expect(resolvePicks("android-app", "2027-01-04").top?.modelSlug).toBe("claude-opus-5-5");
    const live = getBuild("zh", "android-app");
    expect(live?.roles[0]?.primary.name).toBe("Claude Opus 5.5");
    expect(live?.roles[0]?.alternative).toContain("GPT 6 Sol");
    expect(live?.roles[0]?.alternative).toContain("不到一半");
    expect(resolvePicks("android-app", "2027-01-05").top).toBeUndefined();
    expect(resolvePicks("android-app", "2027-01-05").stale).toBe(true);

    const build = getBuild("zh", "android-app", "2027-01-05");
    expect(build?.stale).toBe(true);
    expect(build?.roles[0]?.primary.stale).toBe(true);
    expect(build?.roles[0]?.primary.name).toBe("模型推荐已撤下");
    expect(build?.roles[0]?.primary.href).toBe("/zh/scenarios/android-app/");
    expect(build?.roles[0]?.alternative).toBe("");
    expect(build?.combo).not.toContain("Claude");
    expect(build?.roles.some((role) => role.primary.name === "Jetpack Compose")).toBe(true);
  });
});

describe("dates", () => {
  it("rejects dates that overflow the calendar", () => {
    const withDate = (asOf: string) => ({
      ...content,
      benchmarks: content.benchmarks.map((benchmark, index) => index === 0 ? { ...benchmark, asOf } : benchmark),
    });
    expect(validateContent(withDate("2026-02-30")).some((error) => error.includes("2026-02-30"))).toBe(true);
    expect(validateContent(withDate("2026-02-29")).some((error) => error.includes("2026-02-29"))).toBe(true);
    expect(validateContent(withDate("2024-02-29")).some((error) => error.includes("2024-02-29"))).toBe(false);
  });
});

describe("locale paths", () => {
  it("keeps English at the root and Chinese under /zh", () => {
    expect(localePath("en", "/scenarios/web-frontend")).toBe("/scenarios/web-frontend/");
    expect(localePath("zh", "/")).toBe("/zh/");
    expect(localePath("zh", "/build/web-frontend")).toBe("/zh/build/web-frontend/");
    expect(swapLocale("/zh/models/claude-opus-5-5/", "en")).toBe("/models/claude-opus-5-5/");
    expect(swapLocale("/tools/motion", "zh")).toBe("/zh/tools/motion/");
  });
});
