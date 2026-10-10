import { expect, test } from "@playwright/test";

test("chinese home shows the scenario boards", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("按场景，选对模型与框架");
  await expect(page.getByRole("heading", { name: "场景榜单" })).toBeVisible();
  await expect(page.locator("section", { has: page.getByRole("heading", { name: "场景榜单" }) }).locator("article")).toHaveCount(6);
  await expect(page.getByText("1813").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /查看更多/ }).first()).toBeVisible();
  await expect(page.getByText("查看完整榜单")).toHaveCount(0);
  const bench = page.getByRole("link", { name: "Android Bench 1.0", exact: true });
  await expect(bench).toHaveAttribute("href", "/zh/benchmarks/android-bench-1/");
  await expect(page.locator("#sources")).toBeVisible();
  await bench.click();
  await expect(page).toHaveURL(/\/zh\/benchmarks\/android-bench-1\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Android Bench 1.0");
});

test("a board card model opens its model page", async ({ page }) => {
  await page.goto("/zh/");
  const model = page.getByRole("link", { name: "Claude Opus 5.5" }).first();
  await expect(model).toHaveAttribute("href", "/zh/models/claude-opus-5-5/");
  await expect(model).toHaveCSS("cursor", "pointer");
  await expect(model).toHaveCSS("text-decoration-line", "none");
  await model.hover();
  await model.click();
  await expect(page).toHaveURL(/\/zh\/models\/claude-opus-5-5\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Claude Opus 5.5");
});

test("view more opens every scenario as a board card", async ({ page }) => {
  await page.goto("/zh/");
  const section = page.locator("section", { has: page.getByRole("heading", { name: "场景榜单" }) });
  await section.locator("header").getByRole("link", { name: /查看更多/ }).click();
  await expect(page).toHaveURL(/\/zh\/scenarios\/$/);
  const cards = page.locator("article");
  await expect(cards).toHaveCount(6);
  await expect(page.getByRole("link", { name: "做全栈 SaaS" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Android Bench 1.0", exact: true })).toBeVisible();
});

test("english home is unprefixed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pick the model and the stack for the job");
  await expect(page.getByRole("link", { name: /View More/ }).first()).toBeVisible();
  await expect(page.getByText("View the full board")).toHaveCount(0);
});

test("web scenario keeps the full source board", async ({ page }) => {
  await page.goto("/zh/scenarios/web-frontend/");
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toBeVisible();
  await expect(page.getByText("1813").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "devstral-medium-2507" })).toHaveCount(0);
  await page.getByRole("button", { name: /显示全部/ }).click();
  await expect(page.getByRole("link", { name: "devstral-medium-2507" })).toBeVisible();
  await page.getByRole("button", { name: "开源权重" }).click();
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "devstral-medium-2507" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "mimo-v2.6-flash" })).toBeVisible();
  const mimo = page.getByRole("row").filter({ hasText: "mimo-v2.6-flash" });
  await expect(mimo.getByText("16", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /显示全部/ }).click();
  await expect(page.getByRole("link", { name: "granite-4.1-8b" })).toBeVisible();
});

test("android scenario shows both source tables", async ({ page }) => {
  await page.goto("/zh/scenarios/android-app/");
  await expect(page.getByRole("link", { name: "Claude Opus 5" })).toBeVisible();
  await expect(page.getByText("91.8").first()).toBeVisible();
  await expect(page.getByText("32.7")).toHaveCount(0);
  await page.getByRole("button", { name: "2.0 长程" }).click();
  await expect(page.getByRole("link", { name: "Claude Opus 5.5" })).toBeVisible();
  await expect(page.getByText("32.7").first()).toBeVisible();
  await expect(page.getByText("claude-code").first()).toBeVisible();
  await expect(page.getByText("84.7").first()).toBeVisible();
  await expect(page.getByText("18.7–47.3").first()).toBeVisible();
  await page.goto("/zh/scenarios/android-app/#long");
  await expect(page.getByText("32.7").first()).toBeVisible();
  await expect(page.getByText("Gemini 3.8 Flash").first()).toBeVisible();
});

test("removed scenario urls land on the source board", async ({ page }) => {
  await page.goto("/zh/scenarios/open-frontend/");
  await expect(page).toHaveURL(/\/zh\/scenarios\/web-frontend\/$/);
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toBeVisible();
  await page.goto("/scenarios/refactor/");
  await expect(page).toHaveURL(/\/scenarios\/android-app\/#long$/);
  await expect(page.getByText("32.7").first()).toBeVisible();
});

test("model, skill, library, category, and build pages render", async ({ page }) => {
  await page.goto("/zh/models/claude-opus-5-5/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Claude Opus 5.5");

  await page.goto("/zh/benchmarks/swe-bench-verified/");
  await expect(page.locator("[data-stale=true]")).toBeVisible();

  await page.goto("/zh/tools/motion/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("动效");

  await page.goto("/zh/libraries/phosphor-icons/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Phosphor Icons");

  await page.goto("/zh/skills/frontend-design/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("frontend-design");

  await page.goto("/zh/build/web-frontend/");
  await expect(page.getByText("AGENTS.md").first()).toBeVisible();
  await expect(page.getByText("frontend-design").first()).toBeVisible();
});

test("language switch keeps the page", async ({ page }) => {
  await page.goto("/zh/scenarios/web-frontend/");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/scenarios\/web-frontend\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("theme toggle persists the dark class", async ({ page }) => {
  await page.goto("/zh/");
  await page.getByRole("button", { name: "切换主题" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("framework evals stay on separate boards", async ({ page }) => {
  await page.goto("/zh/libraries/supabase/");
  await expect(page.getByRole("heading", { name: "框架评测" })).toBeVisible();
  await expect(page.getByText("91.3").first()).toBeVisible();

  await page.goto("/zh/skills/supabase-skills/");
  await expect(page.getByRole("heading", { name: "有材料相对基线的变化" })).toBeVisible();
  await expect(page.getByText("−1.4")).toBeVisible();
  await expect(page.getByText("0", { exact: true }).first()).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/libraries/convex/");
  await expect(page.getByText("90.18").first()).toBeVisible();
  await expect(page.getByText("无指南 + 网页")).toBeVisible();
  await expect(page.getByText("With Guidelines 没有收录")).toBeVisible();
  const convexOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(convexOverflow).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto("/zh/prompts/convex-ai-rules/");
  await expect(page.getByRole("heading", { name: "对照臂未核实" })).toBeVisible();
  await expect(page.locator("table")).toHaveCount(0);

  await page.goto("/zh/prompts/nextjs-agents-md/");
  await expect(page.getByText("+13.0").first()).toBeVisible();

  await page.goto("/zh/libraries/react/");
  await expect(page.getByRole("heading", { name: "生态评测" })).toBeVisible();
  await expect(page.getByText("不是 React 或 Meta 的官方榜")).toBeVisible();

  await page.goto("/zh/build/saas/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("全栈");
  await expect(page.getByText("不把 Next.js、Supabase、Convex、ReactBench 的通过率加在一起")).toBeVisible();
});

test("scenario, model, build, and benchmark pages match the home width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const measure = () => page.locator("main").evaluate((el) => getComputedStyle(el).maxWidth);
  await page.goto("/zh/");
  const home = await measure();
  for (const path of [
    "/zh/scenarios/",
    "/zh/scenarios/web-frontend/",
    "/zh/models/",
    "/zh/models/claude-opus-5-5/",
    "/zh/build/",
    "/zh/build/saas/",
    "/zh/benchmarks/",
    "/zh/benchmarks/supabase-evals/",
  ]) {
    await page.goto(path);
    expect(await measure()).toBe(home);
    const footer = await page.locator("footer > div").evaluate((el) => getComputedStyle(el).maxWidth);
    expect(footer).toBe(home);
  }
});

test("home does not scroll sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
