import { describe, expect, it } from "vitest";
import { LOBE_VENDORS } from "@/components/vendor-mark";
import { content } from "@/content";
import { validateContent } from "@/content/validate";
import { getBenchmark, getBuild, getItem, getModel, getScenario, resolvePicks } from "@/lib/catalog";
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
    expect(getBenchmark("zh", "android-bench-1")?.stale).toBe(false);
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
    expect(resolvePicks("cli-devops").open).toBeUndefined();
    expect(resolvePicks("android-app").value?.modelSlug).toBe("gpt-5-6-luna");
    expect(resolvePicks("saas").value?.modelSlug).toBe("gpt-6-1-sol");
  });

  it("follows the sudo L7 leaderboard order", () => {
    const picks = resolvePicks("production-changes");
    expect(picks.stale).toBe(false);
    expect(picks.top?.modelSlug).toBe("claude-sonnet-5-5");
    expect(picks.top?.score).toBe(45);
    expect(picks.value?.modelSlug).toBe("gpt-6-1-sol");
    expect(picks.open?.modelSlug).toBe("glm-5-3");

    const scenario = getScenario("zh", "production-changes");
    expect(scenario?.rows.map((row) => [row.name, row.scoreNumber])).toEqual([
      ["Claude Sonnet 5.5", 45],
      ["Claude Opus 5.5", 45],
      ["GPT-6 Astra", 32.2],
      ["GPT-6.1 Sol", 31.7],
      ["Claude Fable 5.1", 27.2],
      ["Qwen3.8 Max", 15.6],
      ["GLM-5.3", 15],
      ["Kimi K3", 13.9],
      ["Muse Spark 1.3", 12.2],
      ["HY4 Preview", 11.1],
      ["Gemini 3.8 Flash", 10.6],
      ["Grok 4.7", 10.6],
    ]);
    expect(getBenchmark("en", "sudo-l7")?.links.map((link) => link.href)).toEqual([
      "https://surgehq.ai/benchmarks/sudo-l7",
      "https://surgehq.ai/blog/sudo-l7",
    ]);
    expect(getModel("en", "claude-sonnet-5-5")?.appearances.some((row) => row.href === "/scenarios/production-changes/")).toBe(true);
    expect(getModel("zh", "gemini-3-8-flash")?.scoreRows.some((row) => row.name === "sudo L7" && row.score === "10.6")).toBe(true);
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
    expect(resolvePicks("android-app", "2026-11-09").top?.modelSlug).toBe("claude-opus-5");
    expect(resolvePicks("android-app", "2026-11-10").top).toBeUndefined();
    expect(resolvePicks("android-app", "2026-11-10").stale).toBe(true);

    const build = getBuild("zh", "android-app", "2026-11-10");
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
