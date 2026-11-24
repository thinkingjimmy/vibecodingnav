import { describe, expect, it } from "vitest";
import { LOBE_VENDORS } from "@/components/vendor-mark";
import { content } from "@/content";
import convexWithRows from "@/content/boards/convex-with.json";
import slopRows from "@/content/boards/slop-index.json";
import { validateContent } from "@/content/validate";
import { getBenchmark, getBuild, getHome, getItem, getModel, getScenario, isOfficialBoardRow, listScenarioCards, resolvePicks } from "@/lib/catalog";
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

  it("rejects a specific benchmark used by two scenarios", () => {
    const donor = content.scenarios.find((scenario) => scenario.slug === "android-app")!;
    const extra = { ...donor, slug: "duplicate-board", related: [], build: undefined, boards: undefined };
    const errors = validateContent({ ...content, scenarios: [...content.scenarios, extra] });
    expect(errors.some((error) => error.includes("specific") && error.includes("android-bench") && error.includes("duplicate-board"))).toBe(true);
  });

  it("allows a general benchmark in multiple scenarios", () => {
    expect(content.benchmarks.find((benchmark) => benchmark.slug === "sudo-l7")?.scope).toBe("general");
    expect(content.benchmarks.find((benchmark) => benchmark.slug === "deepswe-v1-1")?.scope).toBe("general");
    expect(content.benchmarks.find((benchmark) => benchmark.slug === "frontiercode")?.scope).toBe("general");
    expect(validateContent(content)).toEqual([]);
    const sudoOwners = content.scenarios
      .filter((scenario) => scenario.boards?.some((board) => board.benchmark === "sudo-l7") || scenario.benchmark === "sudo-l7")
      .map((scenario) => scenario.slug);
    expect(sudoOwners).toEqual(["web-frontend", "android-app"]);
    const deepsweOwners = content.scenarios
      .filter((scenario) => scenario.boards?.some((board) => board.benchmark === "deepswe-v1-1") || scenario.benchmark === "deepswe-v1-1")
      .map((scenario) => scenario.slug);
    expect(deepsweOwners).toEqual(["web-frontend", "android-app", "cli-devops"]);
    const frontierOwners = content.scenarios
      .filter((scenario) => scenario.boards?.some((board) => board.benchmark === "frontiercode") || scenario.benchmark === "frontiercode")
      .map((scenario) => scenario.slug);
    expect(frontierOwners).toEqual(["web-frontend", "android-app", "cli-devops"]);
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
    const webRows = content.results.filter((row) => row.benchmark === "lmarena-webdev");
    const official = webRows.filter((row) => isOfficialBoardRow(row));
    const provisional = webRows.filter((row) => row.provisional);
    expect(official[0]?.modelSlug).toBe(picks.top?.modelSlug);
    expect(picks.top).toMatchObject({ modelSlug: "claude-fable-5-2", score: 1826, rank: 1 });
    expect(provisional).toHaveLength(1);
    expect(provisional[0]).toMatchObject({ label: "ernie-5.5-flash-preview", score: 1668, votes: "N/A" });
    expect(provisional[0]?.rank).toBeUndefined();
    expect(provisional[0]?.modelSlug).toBeUndefined();
    expect(isOfficialBoardRow(provisional[0]!)).toBe(false);
    expect(isOfficialBoardRow({ rank: 1, provisional: "autoeval" })).toBe(false);
    const fableRows = webRows.filter((row) => row.modelSlug === "claude-fable-5-2" || row.label?.includes("fable-5.2") || row.label?.includes("fable-5-2"));
    expect(fableRows).toHaveLength(1);
    expect(fableRows[0]?.provisional).toBeUndefined();
    expect(isOfficialBoardRow(fableRows[0]!)).toBe(true);
    const promoted = { ...fableRows[0]!, provisional: undefined };
    expect(isOfficialBoardRow(promoted)).toBe(true);
    const fusion = getScenario("zh", "web-frontend")?.fusion.rows ?? [];
    expect(fusion.filter((row) => row.slug === "claude-fable-5-2")).toHaveLength(1);
    expect(fusion.some((row) => row.name.toLowerCase().includes("ernie"))).toBe(false);
    expect(getHome("zh").cards.every((card) => card.rows.every((row) => !row.name.includes("Ernie")))).toBe(true);
    expect(getBenchmark("zh", "lmarena-webdev")?.provisional?.[0]).toMatchObject({ name: "ernie-5.5-flash-preview", score: "1668", votes: "N/A" });
    expect(picks.value?.modelSlug).toBe("claude-opus-5-5");
    expect(picks.value?.score).toBe(1816);
    const qwen = webRows.find((row) => row.label === "qwen4-max-xhigh");
    expect(qwen).toMatchObject({ rank: 6, score: 1750, preliminary: true, votes: "1,814" });
    expect(qwen?.provisional).toBeUndefined();
    expect(qwen?.modelSlug).toBeUndefined();
    expect(isOfficialBoardRow(qwen!)).toBe(true);
    const imageQwen = content.results.find((row) => row.benchmark === "lmarena-image-to-webdev" && row.label === "qwen4-max-xhigh");
    expect(imageQwen).toMatchObject({ rank: 6, score: 1674, preliminary: true, votes: "1,474" });
    expect(imageQwen?.modelSlug).toBeUndefined();
    expect(isOfficialBoardRow(imageQwen!)).toBe(true);
    expect(picks.open?.modelSlug).toBe("deepseek-v4-1-flash");
  });

  it("resolves cheaper terminal and android rows", () => {
    expect(resolvePicks("cli-devops").value?.modelSlug).toBe("gpt-6-1-sol");
    expect(resolvePicks("cli-devops").open?.modelSlug).toBe("glm-5-3");
    expect(resolvePicks("android-app").top?.modelSlug).toBe("claude-fable-5-2");
    expect(resolvePicks("android-app").value?.modelSlug).toBe("claude-opus-5-5");
  });

  it("keeps sudo L7 on the Web frontend and Android scenarios", () => {
    expect(getScenario("zh", "production-changes")).toBeUndefined();
    expect(getBenchmark("zh", "sudo-l7")?.scenarios.map((row) => row.href)).toEqual([
      "/zh/scenarios/web-frontend/",
      "/zh/scenarios/android-app/",
    ]);
    expect(getBenchmark("en", "sudo-l7")?.links.map((link) => link.href)).toEqual([
      "https://surgehq.ai/benchmarks/sudo-l7",
      "https://surgehq.ai/blog/sudo-l7",
    ]);
    expect(getBenchmark("zh", "sudo-l7")?.leaderboard?.map((row) => [row.name, row.scoreNumber])).toEqual([
      ["Claude Fable 5.2", 52.2],
      ["Claude Sonnet 5.5", 50.6],
      ["Claude Opus 5.5", 46.1],
      ["GPT 6.2 Astra", 38.3],
      ["Gemini 4 Neon", 38.3],
      ["GPT 6.2 Sol", 36.1],
      ["GPT 6.1 Sol", 33.9],
      ["Claude Fable 5.1", 32.2],
      ["Gemini 4 Hydrogen", 31.7],
      ["GPT 6 Astra", 31.1],
      ["Gemini 4 Carbon", 30.6],
      ["Qwen 4 Max", 22.8],
      ["MiniMax M3.1 Flash", 18.9],
      ["Qwen 3.8 Max", 16.7],
      ["Kimi K3.1 Pro", 16.7],
      ["Gemini 4 Argon", 16.1],
      ["Muse Wonder 1.0", 16.1],
      ["Hy4 Preview", 15.6],
      ["Inkling 2 Small", 14.1],
      ["Mistral Large 4", 13.9],
      ["Muse Spark 1.3", 12.8],
      ["Kimi K3", 12.2],
      ["Grok 4.7", 12.2],
      ["Gemini 3.8 Flash", 10.6],
      ["GLM 5.3", 9.4],
    ]);
    expect(getModel("en", "claude-sonnet-5-5")?.appearances.some((row) => row.href === "/scenarios/web-frontend/")).toBe(true);
    expect(getModel("en", "claude-opus-5-5")?.appearances.some((row) => row.href === "/scenarios/android-app/")).toBe(true);
    expect(getModel("zh", "gemini-3-8-flash")?.scoreRows.some((row) => row.name === "sudo L7" && row.score === "10.6")).toBe(true);
  });

  it("keeps one board per scenario on the home page and the scenario list", () => {
    const home = getHome("zh").cards.map((card) => card.title);
    const all = listScenarioCards("zh").map((card) => card.title);
    expect(home).toEqual([
      "做 Web 前端",
      "做一个 Android App",
      "写 CLI、脚本与 DevOps",
      "写文档和文案",
    ]);
    expect(all).toEqual(home);
    expect(getBenchmark("zh", "slop-index")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/write-docs/"]);
    expect(resolvePicks("write-docs").top?.modelSlug).toBe("deepseek-v4-1-flash");
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
    expect(web?.boards[0]?.rows).toHaveLength(158);
    expect(web?.boards[0]?.rows[0]).toMatchObject({ name: "claude-fable-5.2-xhigh", rank: 1, score: "1826" });
    expect(web?.boards[0]?.rows[1]).toMatchObject({ name: "claude-opus-5.5-max", rank: 2, score: "1816" });
    expect(web?.boards[0]?.rows[3]).toMatchObject({ name: "gemini-4-carbon-high", rank: 4, score: "1768" });
    expect(web?.boards[0]?.rows[5]).toMatchObject({ name: "qwen4-max-xhigh", rank: 6, score: "1750" });
    expect(web?.boards[0]?.rows[6]).toMatchObject({ name: "claude-fable-5.1-max", rank: 7, score: "1743" });
    expect(web?.boards[0]?.rows[7]).toMatchObject({ name: "gpt-6.1-sol-max", rank: 8, score: "1742" });
    expect(web?.boards[0]?.rows[10]).toMatchObject({ name: "gemini-4-hydrogen-high", rank: 11, score: "1704" });
    expect(web?.boards[0]?.rows[12]).toMatchObject({ name: "kimi-k3.1-pro-max", rank: 13, score: "1686" });
    expect(web?.boards[0]?.rows[13]).toMatchObject({ name: "gpt-6.1-terra-max", rank: 14, score: "1681" });
    expect(web?.boards[0]?.rows[21]).toMatchObject({ name: "muse-spark-1.3-max", rank: 22, score: "1655" });
    expect(web?.boards[0]?.rows[23]).toMatchObject({ name: "inkling-2-small", rank: 24, score: "1645" });
    expect(web?.rows.some((row) => row.price === "$0.6k")).toBe(false);

    const android = getScenario("zh", "android-app");
    expect(android?.boards.map((board) => [board.id, board.rows.length])).toEqual([
      ["current", 18],
      ["sudo", 25],
      ["deepswe", 28],
      ["frontiercode", 102],
    ]);
    expect(android?.boards[0]?.rows.map((row) => [row.rank, row.name, row.agent, row.effort, row.score, row.ci, row.completion, row.latency, row.price])).toEqual([
      [1, "Claude Fable 5.2", "claude-code", "max", "40.0", "24.0–54.7", "87.7", "84.3", "$2989.6"],
      [1, "Claude Sonnet 5.5", "claude-code", "max", "40.0", "24.0–56.0", "80.9", "70.7", "$1574.9"],
      [3, "Claude Opus 5.5", "claude-code", "max", "37.3", "22.0–52.0", "85.6", "56.6", "$1150.3"],
      [4, "GPT 6.1 Sol", "codex", "max", "29.3", "15.3–42.7", "82.8", "26.6", "$99.5"],
      [5, "GPT 6.1 Terra", "codex", "max", "28.7", "14.0–42.7", "81.1", "18.7", "$178.3"],
      [6, "GPT 6 Astra", "codex", "high", "28.0", "13.3–42.0", "82.2", "7.9", "$375.7"],
      [7, "Kimi K3.1 Pro", "kimi-code", "max", "24.0", "12.0–37.3", "82.3", "27.4", "$317.4"],
      [8, "Gemini 4 Carbon", "antigravity-sdk", "high", "23.3", "11.3–36.7", "83.7", "31.0", "$183.6"],
      [9, "Claude Fable 5.1", "claude-code", "high", "22.7", "10.7–36.0", "82.4", "22.2", "$492.6"],
      [10, "Gemini 4 Argon", "antigravity-sdk", "high", "21.3", "10.0–33.3", "81.8", "52.8", "$267.6"],
      [11, "Claude Haiku 5.5", "claude-code", "max", "20.7", "8.0–33.3", "74.3", "22.9", "$191.4"],
      [12, "DeepSeek V4.1 Flash 1017", "opencode", "high", "17.3", "6.7–28.7", "71.2", "12.0", "$9.9"],
      [13, "Muse Wonder", "muse-code", "max", "13.3", "4.7–22.7", "74.6", "14.4", "$271.9"],
      [14, "Qwen3.8 Max", "qwen-coder", "default", "12.5", "4.2–21.7", "75.0", "45.4", "$258.4"],
      [15, "Kimi K3", "kimi-code", "max", "12.0", "3.3–22.0", "72.8", "66.2", "$418.3"],
      [16, "GPT 6 Luna", "codex", "default", "10.7", "4.0–17.3", "53.2", "6.2", "$5.3"],
      [17, "Gemini 3.8 Flash", "antigravity-sdk", "default", "8.0", "3.3–13.3", "47.4", "12.1", "$34.5"],
      [18, "Gemini 3.7 Flash", "antigravity-sdk", "default", "7.3", "1.3–14.7", "50.1", "9.9", "$26.0"],
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
    const writeDocs = getScenario("zh", "write-docs");
    expect(writeDocs?.boards.map((board) => [board.id, board.rows.length])).toEqual([
      ["slop", 70],
      ["creative", 146],
    ]);
    const slop = writeDocs?.boards[0]?.rows ?? [];
    expect(slop[0]).toMatchObject({ name: "Muse Ember", rank: 1, score: "75" });
    expect(slop[0]?.href).toBeUndefined();
    expect(slop[1]).toMatchObject({ name: "DeepSeek V4.1 Flash", rank: 2, score: "74" });
    expect(slop[2]).toMatchObject({ name: "GPT-5.6 Sol", rank: 3, score: "71", price: "$17.5" });
    expect(slop[10]).toMatchObject({ name: "GPT-6 Sol Pro", rank: 11, score: "67" });
    expect(slop[10]?.href).toBeUndefined();
    expect(slop[69]).toMatchObject({ name: "Seed 2.1 Turbo", rank: 70, score: "35" });
    expect(getBenchmark("zh", "slop-index")?.leaderboard).toHaveLength(70);
    const creative = getBenchmark("zh", "eqbench-creative-writing");
    expect(creative?.leaderboard).toHaveLength(146);
    expect(creative?.leaderboard?.[0]).toMatchObject({ name: "gpt-6-astra", rank: 1, score: "2176.9" });
    expect(creative?.leaderboard?.[1]).toMatchObject({ name: "kimi-k3.1-pro", rank: 2, score: "2172.6" });
    expect(creative?.leaderboard?.[9]).toMatchObject({ name: "muse-wonder", rank: 10, score: "2007.0" });
    expect(creative?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/write-docs/"]);
    expect(getBenchmark("zh", "lmarena-webdev")?.leaderboard).toHaveLength(158);
    const androidBench = getBenchmark("zh", "android-bench");
    expect(androidBench?.versions?.map((version) => version.id)).toEqual(["2.0", "1.0"]);
    expect(androidBench?.versions?.[0]?.current).toBe(true);
    expect(androidBench?.leaderboard).toHaveLength(18);
    expect(androidBench?.leaderboard?.[0]).toMatchObject({ name: "Claude Fable 5.2", agent: "claude-code", score: "40.0", rank: 1 });
    expect(androidBench?.leaderboard?.[1]).toMatchObject({ name: "Claude Sonnet 5.5", agent: "claude-code", score: "40.0", rank: 1 });
    expect(getBenchmark("en", "android-bench")?.versions?.[1]?.label).toBe("1.0");
  });

  it("fuses scenario boards by model and composite score", () => {
    const web = getScenario("zh", "web-frontend");
    expect(web?.thesis).toContain("按真人盲测、设计还原");
    expect(web?.takeaway?.sentence).toMatch(/Claude Opus 5\.5/);
    expect(web?.takeaway?.sentence).toContain("5");
    expect(web?.comboSection?.items[0]).toMatchObject({ highlight: true, purpose: "写代码的主力" });
    expect(getScenario("zh", "cli-devops")?.takeaway?.sentence).toMatch(/Claude Opus 5\.5/);
    expect(getScenario("zh", "cli-devops")?.takeaway?.sentence).toMatch(/第一/);
    expect(getScenario("zh", "write-docs")?.thesis).toContain("真人写作");
    expect(getScenario("zh", "write-docs")?.fusion.columns.map((column) => [column.id, column.label, column.icon, column.weight])).toEqual([
      ["slop-index", "像真人", "article", 1],
      ["eqbench-creative-writing", "创意写作", "pen-nib", 0.6],
    ]);
    expect(getScenario("zh", "write-docs")?.takeaway?.sentence).toMatch(/GPT 6 Sol/);
    expect(getScenario("zh", "write-docs")?.takeaway?.sentence).toMatch(/0 项第一/);
    expect(getScenario("en", "web-frontend")?.takeaway?.sentence).toMatch(/first on/i);
    expect(web?.fusion.columns.map((column) => [column.id, column.weight])).toEqual([
      ["lmarena-webdev", 1],
      ["lmarena-image-to-webdev", 0.6],
      ["sudo-l7", 0.6],
      ["deepswe-v1-1", 0.6],
      ["frontiercode", 0.6],
      ["nextjs-evals", 0.4],
      ["reactbench", 0.4],
    ]);
    expect(web?.fusion.columns.map((column) => column.label)).toEqual([
      "盲测投票",
      "还原设计",
      "工程判断",
      "长程工程",
      "能否合并",
      "Next.js 任务",
      "React 任务",
    ]);
    expect(web?.fusion.columns.map((column) => column.icon)).toEqual([
      "users-three",
      "image",
      "scales",
      "road-horizon",
      "git-merge",
      "file-code",
      "atom",
    ]);
    expect(web?.scoring.weights.map((row) => row.name)).toEqual([
      "LMArena WebDev",
      "LMArena Image-to-WebDev",
      "sudo L7",
      "DeepSWE v1.1",
      "FrontierCode",
      "Next.js Agent Evals",
      "ReactBench",
    ]);
    expect(web?.scoring.chart?.dimensions).toEqual([
      "盲测投票",
      "还原设计",
      "工程判断",
      "长程工程",
      "能否合并",
      "Next.js 任务",
      "React 任务",
    ]);
    expect(web?.scoring.chart?.caption).toContain("LMArena WebDev");
    expect(web?.scoring.chart?.caption).toContain("第 3");
    expect(web?.scoring.worked).toMatchObject({
      key: "model:claude-fable-5-2",
      name: "Claude Fable 5.2",
      composite: 87,
    });
    expect(web?.scoring.worked?.rows.map((row) => row.board)).toEqual([
      "盲测投票",
      "还原设计",
      "工程判断",
      "长程工程",
      "能否合并",
      "Next.js 任务",
      "React 任务",
    ]);
    expect(web?.scoring.worked?.rows).toHaveLength(7);
    const opus = web?.fusion.rows.find((row) => row.slug === "claude-opus-5-5");
    expect(opus?.cells.map((cell) => cell?.rank ?? null)).toEqual([2, 1, 3, null, 2, 1, 1]);
    expect(opus).toMatchObject({ compositeLabel: "96", count: 6, total: 7 });
    expect(opus?.cells[0]?.tip).toContain("1816");
    expect(opus?.cells[0]?.tip).toContain("claude-opus-5.5-max");
    expect(opus?.cells[0]?.tip).toContain("max");
    const fable = web?.fusion.rows.find((row) => row.slug === "claude-fable-5-1");
    expect(fable?.cells.map((cell) => cell?.rank ?? null)).toEqual([7, 3, 8, null, 7, 4, 3]);
    expect(fable).toMatchObject({ compositeLabel: "80", count: 6 });
    expect(web?.fusion.rows[0]?.slug).toBe("claude-opus-5-5");
    expect(web?.fusion.rows[1]?.slug).toBe("claude-sonnet-5-5");
    expect(web?.fusion.rows[2]?.slug).toBe("claude-fable-5-2");

    const android = getScenario("zh", "android-app");
    expect(android?.fusion.columns.map((column) => [column.id, column.label, column.weight])).toEqual([
      ["android-bench", "安卓开发", 1],
      ["sudo-l7", "工程判断", 0.6],
      ["deepswe-v1-1", "长程工程", 0.6],
      ["frontiercode", "能否合并", 0.6],
    ]);
    expect(android?.fusion.columns.map((column) => column.icon)).toEqual(["android-logo", "scales", "road-horizon", "git-merge"]);
    expect(android?.scoring.chart?.caption).toContain("Android Bench");
    expect(android?.scoring.worked?.composite).toBe(92);
    expect(android?.scoring.worked?.rows).toHaveLength(4);
    const opus55 = android?.fusion.rows.find((row) => row.slug === "claude-opus-5-5");
    expect(android?.fusion.rows.find((row) => row.slug === "claude-opus-5")?.cells.map((cell) => cell?.rank ?? null)).toEqual([
      null,
      null,
      3,
      11,
    ]);
    expect(opus55?.cells.map((cell) => cell?.rank ?? null)).toEqual([3, 3, null, 2]);
    expect(opus55).toMatchObject({ compositeLabel: "92", count: 3, total: 4 });
    expect(opus55?.cells[0]?.tip).toContain("claude-code");
    expect(opus55?.cells[0]?.tip).toContain("37.3");
    expect(android?.fusion.rows[0]?.slug).toBe("claude-sonnet-5-5");
    expect(android?.fusion.rows.map((row) => [row.slug, row.compositeLabel]).slice(0, 5)).toEqual([
      ["claude-sonnet-5-5", "94"],
      ["claude-fable-5-2", "92"],
      ["claude-opus-5-5", "92"],
      ["gpt-6-astra", "79"],
      ["gpt-6-1-sol", "75"],
    ]);

    const cli = getScenario("zh", "cli-devops");
    expect(cli?.fusion.columns.map((column) => [column.id, column.label, column.icon, column.weight])).toEqual([
      ["terminal-bench-4", "终端任务", "terminal-window", 1],
      ["deepswe-v1-1", "长程工程", "road-horizon", 0.6],
      ["frontiercode", "能否合并", "git-merge", 0.6],
    ]);
    expect(cli?.fusion.rows.map((row) => [row.slug, row.compositeLabel]).slice(0, 3)).toEqual([
      ["claude-opus-5-5", "96"],
      ["gpt-6-astra", "93"],
      ["claude-sonnet-5-5", "91"],
    ]);
    expect(getBenchmark("zh", "deepswe-v1-1")?.scenarios.map((row) => row.href)).toEqual([
      "/zh/scenarios/web-frontend/",
      "/zh/scenarios/android-app/",
      "/zh/scenarios/cli-devops/",
    ]);
    expect(getBenchmark("zh", "deepswe-v1-1")?.leaderboard).toHaveLength(28);
    expect(getBenchmark("zh", "deepswe-v1-1")?.leaderboard?.[0]).toMatchObject({
      name: "GPT 6 Astra",
      rank: 1,
      score: "74.1",
    });
    expect(getBenchmark("zh", "frontiercode")?.scenarios.map((row) => row.href)).toEqual([
      "/zh/scenarios/web-frontend/",
      "/zh/scenarios/android-app/",
      "/zh/scenarios/cli-devops/",
    ]);
    expect(getBenchmark("zh", "frontiercode")?.leaderboard).toHaveLength(102);
    expect(getBenchmark("zh", "frontiercode")?.versions?.map((version) => version.id)).toEqual(["2.0", "1.1"]);
    expect(getBenchmark("zh", "frontiercode")?.versions?.[1]?.leaderboard).toHaveLength(130);
    expect(getBenchmark("zh", "frontiercode")?.leaderboard?.[0]).toMatchObject({
      name: "Obsidian 3",
      rank: 1,
      score: "39.2%",
      passRate: "43.1%",
      flagRate: "1.5%",
      price: "$2.20",
      effort: "low",
      agent: "claude-code",
    });
    expect(getBenchmark("zh", "frontiercode")?.leaderboard?.find((row) => row.name === "Claude Opus 5.5" && row.effort === "max")).toMatchObject({
      rank: 2,
      score: "45.5%",
      agent: "claude-code",
    });

    expect(getBenchmark("zh", "supabase-evals")?.scenarios).toEqual([]);
    expect(getBenchmark("zh", "convex-evals")?.scenarios).toEqual([]);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard).toHaveLength(66);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[0]).toMatchObject({ name: "claude-opus-5.5-max", rank: 1, score: "1756", ci: "+19/-19" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[12]).toMatchObject({ name: "deepseek-v4.1-flash-20260910-max", rank: 13, score: "1611" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[13]).toMatchObject({ name: "deepseek-v4.1-flash-20261017-max", rank: 14, score: "1609" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.leaderboard?.[65]).toMatchObject({ name: "gemini-2.5-pro", rank: 66, score: "1285" });
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.chart?.points).toHaveLength(65);
    expect(getBenchmark("zh", "lmarena-image-to-webdev")?.chart?.points.filter((point) => point.pareto).map((point) => [point.name, point.priceLabel])).toEqual([
      ["claude-opus-5.5-max", "16"],
      ["claude-sonnet-5.5-xhigh", "8"],
      ["gpt-6-sol-max", "8"],
      ["muse-spark-1.3-max", "3.5"],
      ["deepseek-v4.1-flash-20260910-max", "0.975"],
      ["mimo-v2.6-flash", "0.245"],
    ]);
    expect(getBenchmark("zh", "nextjs-evals")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "reactbench")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/web-frontend/"]);
    expect(getBenchmark("zh", "android-bench")?.scenarios.map((row) => row.href)).toEqual(["/zh/scenarios/android-app/"]);
    expect(getBenchmark("zh", "android-bench-1")).toBeUndefined();
    expect(getBenchmark("zh", "android-bench-2-long")).toBeUndefined();

    const home = getHome("zh").cards;
    expect(home[0]?.sources?.map((source) => source.name)).toEqual([
      "LMArena WebDev",
      "LMArena Image-to-WebDev",
      "sudo L7",
      "DeepSWE v1.1",
      "FrontierCode",
      "Next.js Agent Evals",
      "ReactBench",
    ]);
    expect(home[0]?.rows).toHaveLength(5);
    expect(home[0]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", rankLabel: "1", score: "96" });
    expect(home[0]?.rows[0]?.detail?.title).toContain("综合 96");
    expect(home[1]?.sources?.map((source) => source.name)).toEqual(["Android Bench", "sudo L7", "DeepSWE v1.1", "FrontierCode"]);
    expect(home[1]?.rows[0]).toMatchObject({ name: "Claude Sonnet 5.5", rankLabel: "1", score: "94" });
    expect(home[1]?.rows.map((row) => [row.name, row.score])).toEqual([
      ["Claude Sonnet 5.5", "94"],
      ["Claude Fable 5.2", "92"],
      ["Claude Opus 5.5", "92"],
      ["GPT-6 Astra", "79"],
      ["GPT-6.1 Sol", "75"],
    ]);
    expect(home[2]?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", score: "96" });
    expect(home[2]?.sources?.map((source) => source.name)).toEqual(["Terminal-Bench 4.0", "DeepSWE v1.1", "FrontierCode"]);
    expect(home[3]?.title).toBe("写文档和文案");
    expect(home[3]?.sources?.map((source) => source.name)).toEqual(["The Slop Index", "EQ-Bench Creative Writing v3"]);
    expect(home[3]?.rows[0]).toMatchObject({ name: "GPT 6 Sol", rankLabel: "1" });
    expect(home[3]?.rows.map((row) => row.name).slice(0, 4)).toEqual([
      "GPT 6 Sol",
      "Claude Opus 5",
      "Kimi K3.1 Pro",
      "Claude Fable 5.1",
    ]);
    expect(home).toHaveLength(4);
  });

  it("keeps framework eval arms as separate scores", () => {
    const board = getItem("zh", "library", "supabase")?.evalView;
    expect(board?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", baseline: "90.0", rank: 1 });
    const uplift = getItem("zh", "skill", "supabase-skills")?.evalView?.rows ?? [];
    expect(uplift.find((row) => row.name === "Claude Opus 5.5")?.delta).toBe("+3.0");
    expect(uplift.find((row) => row.name === "GPT-6.1 Sol")?.delta).toBe("+3.0");
    expect(uplift.find((row) => row.name === "Grok 4.7")?.delta).toBe("−1.0");
    expect(uplift.find((row) => row.name === "Claude Sonnet 5.5")?.delta).toBe("+9.0");

    const convex = getItem("en", "library", "convex")?.evalView;
    expect(convex?.rows).toHaveLength(27);
    expect(convex?.rows.map((row) => row.name).slice(0, 8)).toEqual([
      "Claude Fable 5.2",
      "GPT-6.2 Astra",
      "GPT-6.1 Sol",
      "Claude Opus 5.5",
      "Gemini 4 Argon",
      "Gemini 4 Carbon",
      "GPT-6.2 Sol",
      "Claude Sonnet 5.5",
    ]);
    expect(convex?.rows[0]).toMatchObject({ baseline: "95.97", assisted: "99.19", rank: 1, delta: "+3.22" });
    expect(convex?.rows[4]).toMatchObject({ baseline: "89.52", assisted: "99.19" });
    expect(convex?.rows[0]?.web).toBeUndefined();
    expect(convex?.rows[1]?.href).toBeUndefined();
    expect(convex?.rows[6]?.href).toBeUndefined();
    expect(convex?.rows.find((row) => row.name === "MiMo V2.6 Flash")?.assisted).toBeUndefined();
    expect(convex?.rows.find((row) => row.name === "Step 5 Preview")?.href).toBeUndefined();
    expect(convex?.showWeb).toBe(false);
    expect(convex?.showAssisted).toBe(true);
    const rules = getItem("zh", "prompt", "convex-ai-rules")?.evalView;
    expect(rules?.mode).toBe("uplift");
    expect(rules?.rows.find((row) => row.name === "Claude Opus 5.5")).toMatchObject({ baseline: "90.32", assisted: "98.39", delta: "+8.07" });
    expect(rules?.rows.find((row) => row.name === "GPT-6.1 Sol")).toMatchObject({ baseline: "91.13", assisted: "97.58", delta: "+6.45" });
    expect(rules?.rows.find((row) => row.name === "Claude Fable 5.1")).toBeUndefined();
  });

  it("keeps a Convex with-guidelines rerun a tiny gap and inverts every Slop row", () => {
    const argon = convexWithRows.find((row) => row.model === "google/gemini-4-argon");
    const fable = convexWithRows.find((row) => row.model === "anthropic/claude-fable-5.2");
    expect(fable?.sourceIndex).toBeLessThan(argon?.sourceIndex ?? 99);
    expect(fable?.totalScore).toBe(0.9880952380952381);
    expect(fable?.runCount).toBe(3);
    expect(argon?.totalScore).toBe(0.9866071428571429);
    expect(argon?.runCount).toBe(10);
    const assisted = content.results.filter((row) => row.benchmark === "convex-evals" && row.arm === "assisted" && row.version === "112");
    const currentAssisted = content.results.filter((row) => row.benchmark === "convex-evals" && row.arm === "assisted" && row.version === "124");
    expect(currentAssisted.find((row) => row.modelSlug === "claude-fable-5-2")).toMatchObject({ score: 99.19, rank: 1, asOf: "2026-11-23" });
    expect(currentAssisted.find((row) => row.modelSlug === "gemini-4-argon")).toMatchObject({ score: 99.19, rank: 1, asOf: "2026-11-23" });
    expect(currentAssisted.find((row) => row.modelSlug === "gpt-6-1-sol")).toMatchObject({ score: 97.58, rank: 4, asOf: "2026-11-23" });
    expect(currentAssisted.find((row) => row.label === "GPT-6.2 Astra")).toMatchObject({ score: 96.37, rank: 6 });
    expect(currentAssisted.find((row) => row.label === "GPT-6.2 Sol")).toMatchObject({ score: 93.55, rank: 9 });
    expect(currentAssisted.find((row) => row.modelSlug === "muse-wonder")).toMatchObject({ score: 93.55, rank: 10 });
    expect(currentAssisted.find((row) => row.label === "Step 5 Preview")?.modelSlug).toBeUndefined();
    expect(assisted.find((row) => row.modelSlug === "claude-fable-5-2")).toMatchObject({ score: 98.81, rank: 1, asOf: "2026-11-18" });
    expect(assisted.find((row) => row.modelSlug === "gemini-4-argon")).toMatchObject({ score: 98.66, rank: 2, asOf: "2026-11-18" });
    expect(assisted.find((row) => row.modelSlug === "gemini-4-carbon")).toMatchObject({ score: 95.09, rank: 10, asOf: "2026-11-18" });
    expect(assisted.find((row) => row.modelSlug === "grok-4-5")).toMatchObject({ score: 95.09, rank: 10, asOf: "2026-11-18" });
    expect(assisted.some((row) => row.modelSlug === "gpt-6-2-sol")).toBe(false);
    const gpt62 = convexWithRows.find((row) => row.model === "openai/gpt-6.2-sol");
    const hy4 = convexWithRows.find((row) => row.model === "tencent/hy4-flash");
    expect(gpt62?.totalScore).toBe(0.9107142857142857);
    expect(gpt62?.runCount).toBe(1);
    expect(hy4?.totalScore).toBe(gpt62?.totalScore);
    expect(content.results.find((row) => row.benchmark === "convex-evals" && row.version === "112" && row.arm === "baseline" && row.modelSlug === "claude-fable-5-2")).toMatchObject({ score: 95.54, rank: 1, asOf: "2026-11-12" });
    expect(content.results.find((row) => row.benchmark === "convex-evals" && row.version === "112" && row.arm === "web" && row.modelSlug === "claude-opus-5-5")?.asOf).toBe("2026-10-08");
    const current = getBenchmark("zh", "convex-evals");
    expect(current?.caveats).toContain("待重跑");
    expect(current?.caveats).toContain("不是 0 分");
    expect(current?.updateCadence).toContain("2026-11-12");
    const archivedConvex = current?.versions?.find((version) => version.id === "112");
    expect(archivedConvex?.archived).toBe(true);
    expect(archivedConvex?.evalBoard?.showWeb).toBe(true);
    expect(archivedConvex?.evalBoard?.rows.find((row) => row.name === "Claude Fable 5.2")).toMatchObject({ baseline: "95.54", assisted: "98.81" });
    expect(current?.versions?.find((version) => version.id === "124")?.evalBoard?.rows.find((row) => row.name === "Claude Fable 5.2")).toMatchObject({ baseline: "95.97", assisted: "99.19" });
    expect(current?.versions?.find((version) => version.id === "124")?.evalBoard?.rows.find((row) => row.name === "Gemini 4 Argon")).toMatchObject({ assisted: "99.19" });
    expect(current?.versions?.find((version) => version.id === "124")?.evalBoard?.rows.some((row) => row.name === "Gemini 3.1 Pro Preview")).toBe(false);
    const summary = getModel("zh", "claude-fable-5-2")?.summary ?? "";
    expect(summary).toContain("0.9880952380952381");
    expect(summary).toContain("不是有意义的胜出");
    expect(summary).not.toContain("明确胜出");
    expect(slopRows).toHaveLength(70);
    expect(slopRows.every((row) => row.score === 100 - row.sourceSlop)).toBe(true);
    for (let index = 1; index < slopRows.length; index += 1) {
      expect(slopRows[index]?.sourceSlopRaw).toBeGreaterThanOrEqual(slopRows[index - 1]?.sourceSlopRaw ?? 0);
    }
    expect(slopRows[0]).toMatchObject({ label: "Muse Ember", sourceSlopRaw: 25.29, score: 75 });
    expect(slopRows[0]?.modelSlug).toBeUndefined();
    expect(slopRows[1]).toMatchObject({ label: "DeepSeek V4.1 Flash", sourceSlopRaw: 25.68, score: 74, modelSlug: "deepseek-v4-1-flash" });
    expect(slopRows[2]).toMatchObject({ label: "GPT-5.6 Sol", sourceSlopRaw: 28.57, score: 71 });
    expect(slopRows.find((row) => row.label === "Mercury 2.5")?.modelSlug).toBeUndefined();
    expect(slopRows.find((row) => row.label === "Hunyuan 4")?.modelSlug).toBeUndefined();
    expect(slopRows.find((row) => row.label === "Inkling 2 Small")?.modelSlug).toBeUndefined();
    expect(slopRows.find((row) => row.label === "Inkling Small")).toBeDefined();
    expect(slopRows.find((row) => row.label === "GPT-6 Sol Pro")?.rank).toBe(11);
    expect(slopRows.find((row) => row.label === "GLM-5.3 Prime")?.rank).toBe(6);
    expect(slopRows.find((row) => row.label === "Particle 1")?.rank).toBe(15);
    expect(slopRows.find((row) => row.label === "Particle 1")?.modelSlug).toBeUndefined();
    expect(slopRows.find((row) => row.label === "Nex N2.6")?.rank).toBe(23);
    expect(slopRows.find((row) => row.label === "Inkling 2 Small")?.rank).toBeGreaterThan(20);
    expect(slopRows.find((row) => row.label === "Muse Ember")?.modelSlug).toBeUndefined();

    const next = getItem("en", "prompt", "nextjs-agents-md")?.evalView?.rows ?? [];
    expect(next.find((row) => row.name === "Claude Opus 5.5")?.delta).toBe("0");
    expect(next.find((row) => row.name === "Kimi K3")?.delta).toBe("+13.0");

    const react = getItem("zh", "library", "react")?.evalView;
    expect(react?.kindLabel).toBe("生态评测");
    expect(react?.rows[0]).toMatchObject({ name: "Claude Opus 5.5", rank: 1, baseline: "54.4" });
    expect(react?.rows.some((row) => row.rank === 17)).toBe(true);

    const scores = getModel("zh", "claude-opus-5-5")?.scoreRows.filter((row) => row.name === "Supabase Evals" || row.name === "Convex Evals") ?? [];
    expect(scores.map((row) => row.score)).toEqual(["90.0", "98.39"]);
    expect(getBenchmark("en", "convex-evals")?.version).toBe("32c305f646a2a7502c4112e31ed48f5cb36f022650b026fac526a2e8a8c78453");
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
    expect(build?.roles[0]?.primary.name).toBe("Claude Fable 5.2");
    expect(build?.roles[0]?.alternative).toContain("Claude Opus 5.5");
    expect(build?.roles[0]?.alternative).toContain("DeepSeek V4.1 Flash");
    expect(build?.agentsMd).toContain("frontend-design");
  });
});

describe("stale picks", () => {
  it("withholds the android model once the board is past 90 days", () => {
    expect(resolvePicks("android-app", "2027-02-16").top?.modelSlug).toBe("claude-fable-5-2");
    const live = getBuild("zh", "android-app");
    expect(live?.roles[0]?.primary.name).toBe("Claude Fable 5.2");
    expect(live?.roles[0]?.alternative).toContain("Claude Opus 5.5");
    expect(live?.roles[0]?.alternative).toContain("不到一半");
    expect(resolvePicks("android-app", "2027-02-17").top).toBeUndefined();
    expect(resolvePicks("android-app", "2027-02-17").stale).toBe(true);

    const build = getBuild("zh", "android-app", "2027-02-17");
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
