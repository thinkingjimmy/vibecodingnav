import { expect, test } from "@playwright/test";

test("chinese home shows the scenario boards", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("按场景，选对模型与框架");
  await expect(page.getByRole("heading", { name: "场景榜单" })).toBeVisible();
  await expect(page.getByText("1813").first()).toBeVisible();
  await expect(page.locator("#sources")).toBeVisible();
});

test("english home is unprefixed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pick the model and the stack for the job");
});

test("web scenario can filter to open licenses", async ({ page }) => {
  await page.goto("/zh/scenarios/web-frontend/");
  await expect(page.getByRole("link", { name: /1813/ }).first()).toBeVisible();
  await page.getByRole("button", { name: "开源许可" }).click();
  await expect(page.getByRole("link", { name: /1813/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /MiMo V2.6 Flash/ }).first()).toBeVisible();
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

test("home does not scroll sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
