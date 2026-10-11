import { expect, test, type Page } from "@playwright/test";

function clippedNow(page: Page) {
  return page.locator("table th, table td").evaluateAll((cells) => cells
    .filter((cell) => !cell.querySelector(".truncate") && cell.scrollWidth > cell.clientWidth + 1)
    .map((cell) => (cell.textContent ?? "").trim()));
}

test("chinese home shows the scenario boards", async ({ page }) => {
  await page.goto("/zh/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("按场景，选对模型与框架");
  await expect(page.getByRole("heading", { name: "场景榜单" })).toBeVisible();
  await expect(page.locator("section", { has: page.getByRole("heading", { name: "场景榜单" }) }).locator("article")).toHaveCount(4);
  await expect(page.locator("section", { has: page.getByRole("heading", { name: "场景榜单" }) }).locator("article").first().getByText("97").first()).toBeVisible();
  await expect(page.getByText("#1 · #1 · #1 · —")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /查看更多/ }).first()).toBeVisible();
  await expect(page.getByText("查看完整榜单")).toHaveCount(0);
  const section = page.locator("section", { has: page.getByRole("heading", { name: "场景榜单" }) });
  await expect(section.getByText("LMArena WebDev")).toHaveCount(0);
  await expect(section.getByText("Android Bench")).toHaveCount(0);
  await expect(page.locator("#sources")).toBeVisible();
  const columns = () => section.locator("article").first().locator("xpath=..").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length);
  await page.setViewportSize({ width: 1280, height: 900 });
  expect(await columns()).toBe(3);
  await page.setViewportSize({ width: 800, height: 900 });
  expect(await columns()).toBe(2);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await columns()).toBe(1);
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
  await expect(cards).toHaveCount(4);
  await expect(page.getByRole("link", { name: "做全栈 SaaS" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "做 iOS App" })).toHaveCount(0);
  await expect(page.getByText("LMArena WebDev")).toHaveCount(0);
  await expect(page.getByText("Android Bench", { exact: true })).toHaveCount(0);
  await page.setViewportSize({ width: 1280, height: 900 });
  const columns = await page.locator("article").first().locator("xpath=..").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
});

test("english home is unprefixed", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pick the model and the stack for the job");
  await expect(page.getByRole("link", { name: /View More/ }).first()).toBeVisible();
  await expect(page.getByText("View the full board")).toHaveCount(0);
});

test("web benchmark keeps the full source board", async ({ page }) => {
  await page.goto("/zh/benchmarks/lmarena-webdev/");
  await expect(page.getByText("前端 Web 开发")).toBeVisible();
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toBeVisible();
  await expect(page.getByText("1813").first()).toBeVisible();
  await expect(page.getByText("devstral-medium-2507")).toHaveCount(0);
  await page.getByRole("button", { name: /显示全部/ }).click();
  await expect(page.getByText("devstral-medium-2507")).toBeVisible();
  await page.getByRole("button", { name: "开源权重" }).click();
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toHaveCount(0);
  await expect(page.getByText("devstral-medium-2507")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "mimo-v2.6-flash" })).toBeVisible();
  const mimo = page.getByRole("row").filter({ hasText: "mimo-v2.6-flash" });
  await expect(mimo.getByText("16", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /显示全部/ }).click();
  await expect(page.getByText("granite-4.1-8b")).toBeVisible();
});

test("image-to-webdev shows the full board and the price chart", async ({ page }) => {
  await page.goto("/zh/benchmarks/lmarena-image-to-webdev/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LMArena Image-to-WebDev");
  await expect(page.getByText("看一张图或截图，生成对应的网页")).toBeVisible();
  await expect(page.getByText("这张榜不是文字需求的 WebDev")).toBeVisible();
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toBeVisible();
  await expect(page.getByText("1749").first()).toBeVisible();
  await expect(page.getByText("+30/-30").first()).toBeVisible();
  await expect(page.getByText("gemini-2.5-pro")).toHaveCount(0);
  await page.getByRole("button", { name: /显示全部/ }).click();
  const last = page.getByRole("row").filter({ hasText: "gemini-2.5-pro" });
  await expect(last.getByText("64", { exact: true })).toBeVisible();
  await expect(last.getByText("1285")).toBeVisible();
  await expect(page.getByRole("heading", { name: "分数与价格" })).toBeVisible();
  await expect(page.getByRole("link", { name: "arena.ai/leaderboard/code/image-to-webdev/pareto" })).toHaveAttribute("href", "https://arena.ai/leaderboard/code/image-to-webdev/pareto");
  await expect(page.getByText("1749 · $16/M")).toBeVisible();
  await expect(page.getByText("1581 · $0.17/M")).toBeVisible();
});

test("source board filter and header stay under the nav while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/zh/benchmarks/lmarena-webdev/");
  await page.getByRole("button", { name: /显示全部/ }).click();
  const box = async (selector: string) => {
    const value = await page.locator(selector).first().boundingBox();
    if (!value) throw new Error(`missing box ${selector}`);
    return value;
  };
  const boardTop = await page.locator("[data-board-bar]").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), boardTop);
  const nav = await box("header.sticky");
  const bar = await box("[data-board-bar]");
  const head = await box("[data-board-head] th");
  expect(Math.abs(bar.y - (nav.y + nav.height))).toBeLessThanOrEqual(1);
  expect(Math.abs(head.y - (bar.y + bar.height))).toBeLessThanOrEqual(1);
  await page.evaluate(() => window.scrollBy(0, 240));
  const navMid = await box("header.sticky");
  const barMid = await box("[data-board-bar]");
  const headMid = await box("[data-board-head] th");
  expect(Math.abs(barMid.y - (navMid.y + navMid.height))).toBeLessThanOrEqual(1);
  expect(Math.abs(headMid.y - (barMid.y + barMid.height))).toBeLessThanOrEqual(1);
  await expect(page.getByRole("columnheader", { name: "分数", exact: true })).toBeInViewport();
  await expect(page.getByText("全部", { exact: true })).toBeInViewport();

  await page.setViewportSize({ width: 900, height: 800 });
  const boardTopNarrow = await page.locator("[data-board-scroll]").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y - 120), boardTopNarrow);
  const navNarrow = await box("header.sticky");
  const barNarrow = await box("[data-board-bar]");
  expect(navNarrow.height).toBeGreaterThan(70);
  expect(Math.abs(barNarrow.y - (navNarrow.y + navNarrow.height))).toBeLessThanOrEqual(1);
  await expect(page.getByRole("columnheader", { name: "分数", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const navBottom = await box("header.sticky");
  const barBottom = await box("[data-board-bar]");
  const headBottom = await box("[data-board-head] th");
  expect(Math.abs(barBottom.y - (navBottom.y + navBottom.height))).toBeLessThanOrEqual(1);
  expect(Math.abs(headBottom.y - (barBottom.y + barBottom.height))).toBeLessThanOrEqual(1);
  await expect(page.getByText("devstral-medium-2507")).toBeVisible();

  await page.setViewportSize({ width: 390, height: 700 });
  await page.locator("[data-board-scroll]").evaluate((el) => { el.scrollLeft = 180; });
  const scoreHead = await page.getByRole("columnheader", { name: "分数", exact: true }).boundingBox();
  const scoreCell = await page.locator("tbody tr").first().locator("td").nth(3).boundingBox();
  expect(Math.abs((scoreHead?.x ?? 0) - (scoreCell?.x ?? 0))).toBeLessThanOrEqual(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/zh/benchmarks/sudo-l7/");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const nav2 = await box("header.sticky");
  const head2 = await box("[data-board-head] th");
  expect(Math.abs(head2.y - (nav2.y + nav2.height))).toBeLessThanOrEqual(1);
  await expect(page.locator("[data-board-bar]")).toHaveCount(0);
});

test("web scenario fuses ranks and links each board", async ({ page }) => {
  await page.goto("/zh/scenarios/web-frontend/");
  await expect(page.getByText("默认按综合分排")).toBeVisible();
  await expect(page.getByRole("button", { name: /综合分/ })).toBeVisible();
  const webdev = page.getByRole("columnheader", { name: /WebDev/ }).getByRole("link");
  await expect(webdev).toHaveAttribute("href", "/zh/benchmarks/lmarena-webdev/");
  await expect(page.getByRole("columnheader", { name: /图生网页/ }).getByRole("link")).toHaveAttribute("href", "/zh/benchmarks/lmarena-image-to-webdev/");
  await expect(page.getByRole("columnheader", { name: /Next.js/ }).getByRole("link")).toHaveAttribute("href", "/zh/benchmarks/nextjs-evals/");
  await expect(page.getByRole("columnheader", { name: /ReactBench/ }).getByRole("link")).toHaveAttribute("href", "/zh/benchmarks/reactbench/");
  const opus = page.getByRole("row").filter({ hasText: "Claude Opus 5.5" }).first();
  await expect(opus).toContainText("—");
  await expect(opus).toContainText("3/4");
  const firstName = () => page.locator("tbody tr").first().locator("td").first().innerText();
  const before = await firstName();
  await page.getByRole("button", { name: "按模型排序" }).click();
  expect(await firstName()).not.toBe(before);

  await page.setViewportSize({ width: 1280, height: 800 });
  const fusedTop = await page.locator("[data-fused-head]").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), fusedTop);
  const fusedNav = await page.locator("header.sticky").boundingBox();
  const fusedHead = await page.locator("[data-fused-head] th").first().boundingBox();
  expect(Math.abs((fusedHead?.y ?? 0) - ((fusedNav?.y ?? 0) + (fusedNav?.height ?? 0)))).toBeLessThanOrEqual(1);
  await expect(page.getByRole("columnheader", { name: /图生网页/ })).toBeInViewport();
  await page.setViewportSize({ width: 900, height: 800 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const fusedTopNarrow = await page.locator("[data-fused-head]").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), fusedTopNarrow);
  const fusedNavNarrow = await page.locator("header.sticky").boundingBox();
  const fusedHeadNarrow = await page.locator("[data-fused-head] th").first().boundingBox();
  expect((fusedNavNarrow?.height ?? 0)).toBeGreaterThan(70);
  expect(Math.abs((fusedHeadNarrow?.y ?? 0) - ((fusedNavNarrow?.y ?? 0) + (fusedNavNarrow?.height ?? 0)))).toBeLessThanOrEqual(1);
});

test("switching a source filter keeps the table width", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/zh/benchmarks/lmarena-webdev/");
  const measure = () => page.locator("[data-board-scroll] table").evaluate((table) => {
    const box = table.getBoundingClientRect();
    const heads = [...table.querySelectorAll("th")].map((cell) => {
      const rect = cell.getBoundingClientRect();
      return `${cell.textContent}:${Math.round(rect.x)}:${Math.round(rect.width)}`;
    });
    return { width: Math.round(box.width), x: Math.round(box.x), heads };
  });
  const all = await measure();
  await page.getByRole("button", { name: "开源权重" }).click();
  await expect(page.getByRole("link", { name: "mimo-v2.6-flash" })).toBeVisible();
  expect(await measure()).toEqual(all);
  await page.getByRole("button", { name: "专有" }).click();
  expect(await measure()).toEqual(all);
  await page.getByRole("button", { name: "全部", exact: true }).click();
  await page.getByRole("button", { name: /显示全部/ }).click();
  expect(await clippedNow(page)).toEqual([]);

  await page.goto("/zh/benchmarks/android-bench/");
  await expect(page.getByRole("columnheader", { name: "Agent" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Claude Opus 5.5", exact: true })).toBeVisible();
  await expect(page.getByText("32.7").first()).toBeVisible();
  await expect(page.getByText("claude-code").first()).toBeVisible();
  await expect(page.getByText("84.7").first()).toBeVisible();
  await expect(page.getByText("18.7–47.3").first()).toBeVisible();
  expect(await clippedNow(page)).toEqual([]);
  await page.getByRole("button", { name: "1.0", exact: true }).click();
  await expect(page).toHaveURL(/\/zh\/benchmarks\/android-bench\/\?v=1\.0$/);
  await expect(page.locator("[data-archived=true]")).toContainText("历史版本，不再更新");
  await expect(page.getByText("91.8").first()).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Agent" })).toHaveCount(0);
  await page.getByRole("button", { name: /显示全部/ }).click();
  expect(await clippedNow(page)).toEqual([]);

  await page.goto("/zh/benchmarks/terminal-bench-4/");
  await page.getByRole("button", { name: /显示全部/ }).click();
  await expect(page.getByText("$3.68k (partial: 324/330)")).toBeVisible();
  expect(await clippedNow(page)).toEqual([]);
});

test("android scenario uses only the current version", async ({ page }) => {
  await page.goto("/zh/scenarios/android-app/");
  await expect(page.getByRole("columnheader", { name: /Android Bench 2\.0/ }).getByRole("link")).toHaveAttribute("href", "/zh/benchmarks/android-bench/");
  await expect(page.getByRole("columnheader", { name: /^1\.0/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Claude Opus 5.5", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Claude Opus 5", exact: true })).toHaveCount(0);
  const leader = page.getByRole("row").filter({ hasText: "Claude Opus 5.5" }).first();
  await expect(leader).toContainText("1/1");
  await expect(page.getByRole("tab")).toHaveCount(0);
});

test("removed ios and saas scenarios leave the board list", async ({ page }) => {
  await page.goto("/zh/scenarios/ios-app/");
  await expect(page).toHaveURL(/\/zh\/scenarios\/$/);
  await expect(page.locator("article")).toHaveCount(4);
  await page.goto("/zh/scenarios/saas/");
  await expect(page).toHaveURL(/\/zh\/build\/saas\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("全栈");
  await expect(page.getByRole("link", { name: /写 CLI、脚本与 DevOps/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Supabase Evals" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Convex Evals" })).toBeVisible();
});

test("removed scenario urls land on the source board", async ({ page }) => {
  await page.goto("/zh/scenarios/open-frontend/");
  await expect(page).toHaveURL(/\/zh\/benchmarks\/lmarena-webdev\/$/);
  await expect(page.getByRole("link", { name: "claude-opus-5.5-max" })).toBeVisible();
  await page.goto("/scenarios/refactor/");
  await expect(page).toHaveURL(/\/benchmarks\/android-bench\/$/);
  await expect(page.getByText("32.7").first()).toBeVisible();
});

test("old android urls open the merged board on the matching version", async ({ page }) => {
  await page.goto("/zh/benchmarks/android-bench-1/");
  await expect(page).toHaveURL(/\/zh\/benchmarks\/android-bench\/\?v=1\.0$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Android Bench");
  await expect(page.locator("[data-archived=true]")).toContainText("历史版本，不再更新");
  await expect(page.locator("[data-archived=true]")).toContainText("2026-10-06");
  await expect(page.getByText("91.8").first()).toBeVisible();

  await page.goto("/zh/benchmarks/android-bench-2/");
  await expect(page).toHaveURL(/\/zh\/benchmarks\/android-bench\/\?v=2\.0$/);
  await expect(page.getByText("32.7").first()).toBeVisible();
  await expect(page.locator("[data-archived=true]")).toHaveCount(0);

  await page.goto("/zh/benchmarks/android-bench-2-long/");
  await expect(page).toHaveURL(/\/zh\/benchmarks\/android-bench\/#long$/);
  await expect(page.getByRole("columnheader", { name: "Agent" })).toBeVisible();
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

test("long boards stay inside the phone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/zh/scenarios/web-frontend/", "/zh/scenarios/android-app/", "/zh/scenarios/cli-devops/", "/zh/scenarios/production-changes/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("nav highlights only the current section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const cases: { path: string; label: string; current: string | null }[] = [
    { path: "/", label: "Primary", current: null },
    { path: "/zh/", label: "主导航", current: null },
    { path: "/scenarios/", label: "Primary", current: "Scenarios" },
    { path: "/scenarios/web-frontend/", label: "Primary", current: "Scenarios" },
    { path: "/zh/scenarios/", label: "主导航", current: "场景" },
    { path: "/zh/scenarios/android-app/", label: "主导航", current: "场景" },
    { path: "/models/", label: "Primary", current: "Models" },
    { path: "/zh/models/claude-opus-5-5/", label: "主导航", current: "模型" },
    { path: "/tools/", label: "Primary", current: "Toolbox" },
    { path: "/zh/libraries/phosphor-icons/", label: "主导航", current: "工具箱" },
    { path: "/zh/skills/frontend-design/", label: "主导航", current: "工具箱" },
    { path: "/build/", label: "Primary", current: "Builds" },
    { path: "/zh/build/web-frontend/", label: "主导航", current: "组合" },
    { path: "/benchmarks/", label: "Primary", current: "Benchmarks" },
    { path: "/zh/benchmarks/android-bench/", label: "主导航", current: "基准" },
  ];
  for (const item of cases) {
    await page.goto(item.path);
    const nav = page.getByRole("navigation", { name: item.label }).first();
    const current = nav.locator("[aria-current='page']");
    if (item.current) {
      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(item.current);
    } else {
      await expect(current).toHaveCount(0);
    }
  }
});

test("closing search does not outline the trigger, and tab still shows a ring", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const item of [
    { path: "/", name: "Search" },
    { path: "/zh/", name: "搜索" },
  ]) {
    await page.goto(item.path);
    const trigger = page.getByRole("button", { name: item.name });
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await trigger.evaluate((el) => el.matches(":focus-visible") || getComputedStyle(el).outlineStyle !== "none")).toBe(false);

    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.locator(".fixed.inset-0").click({ position: { x: 8, y: 8 } });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(await trigger.evaluate((el) => el.matches(":focus-visible") || getComputedStyle(el).outlineStyle !== "none")).toBe(false);

    await page.locator("body").click({ position: { x: 4, y: 200 } });
    await page.keyboard.press("Tab");
    const ring = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return { visible: el.matches(":focus-visible"), outline: style.outlineStyle, width: style.outlineWidth };
    });
    expect(ring?.visible).toBe(true);
    expect(ring?.outline).not.toBe("none");
    expect(ring?.width).not.toBe("0px");
  }
});

test("home does not scroll sideways on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/zh/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
