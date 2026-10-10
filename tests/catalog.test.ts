import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { validateContent } from "@/content/validate";
import { getBenchmark, getBuild, getItem, getModel, resolvePicks } from "@/lib/catalog";
import { daysBetween, isStale } from "@/lib/site";
import { localePath, swapLocale } from "@/lib/locale";

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

describe("locale paths", () => {
  it("keeps English at the root and Chinese under /zh", () => {
    expect(localePath("en", "/scenarios/web-frontend")).toBe("/scenarios/web-frontend/");
    expect(localePath("zh", "/")).toBe("/zh/");
    expect(localePath("zh", "/build/web-frontend")).toBe("/zh/build/web-frontend/");
    expect(swapLocale("/zh/models/claude-opus-5-5/", "en")).toBe("/models/claude-opus-5-5/");
    expect(swapLocale("/tools/motion", "zh")).toBe("/zh/tools/motion/");
  });
});
