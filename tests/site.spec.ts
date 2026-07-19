/* 浏览器验收：六语言路由、品牌一致性、语言菜单、SEO、响应式与视觉回归 */
import { expect, test } from "@playwright/test";

const locales = ["en", "zh-CN", "ja", "ko", "es", "fr"] as const;
const nativeNames = ["English", "中文", "日本語", "한국어", "Español", "Français"] as const;
const modelRoutes = {
  en: "/models/kimi-k3/",
  "zh-CN": "/zh-CN/models/kimi-k3/",
  ja: "/ja/models/kimi-k3/",
  ko: "/ko/models/kimi-k3/",
  es: "/es/models/kimi-k3/",
  fr: "/fr/models/kimi-k3/",
} as const;

const cases = [
  { name: "en-desktop", locale: "en", viewport: { width: 1280, height: 900 } },
  { name: "zh-desktop", locale: "zh-CN", viewport: { width: 1280, height: 900 } },
  { name: "en-mobile", locale: "en", viewport: { width: 390, height: 844 } },
  { name: "zh-mobile", locale: "zh-CN", viewport: { width: 390, height: 844 } },
] as const;

for (const current of cases) {
  test(`visual ${current.name}`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: current.viewport });
    await page.goto(modelRoutes[current.locale]);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${current.name}.png`, {
      animations: "disabled",
      fullPage: true,
    });
    await page.close();
  });
}

for (const current of [
  { name: "language-menu-desktop", viewport: { width: 1280, height: 900 } },
  { name: "language-menu-mobile", viewport: { width: 390, height: 844 } },
] as const) {
  test(`visual ${current.name}`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: current.viewport });
    await page.goto(modelRoutes.en);
    await page.waitForLoadState("networkidle");
    await page.evaluate(async () => document.fonts.ready);
    await page.getByRole("button", { name: "Language: English" }).click();
    await expect(page.getByRole("menuitemradio")).toHaveCount(6);
    await expect(page).toHaveScreenshot(`${current.name}.png`, {
      animations: "disabled",
      fullPage: false,
    });
    await page.close();
  });
}

test("visual model-menu-desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(modelRoutes.en);
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => document.fonts.ready);
  await page.getByRole("button", { name: "Models: Kimi K3" }).click();
  await expect(page).toHaveScreenshot("model-menu-desktop.png", {
    animations: "disabled",
    fullPage: false,
  });
});

for (const locale of locales) {
  test(`${locale} 静态页面可达`, async ({ page }) => {
    await page.goto(modelRoutes[locale]);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kimi K3");
  });
}

test("根路径显示 noindex 占位与模型入口", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lang", "fr"));
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Home is coming soon.");
  await expect(page.getByRole("link", { name: /View Kimi K3/ })).toHaveAttribute("href", modelRoutes.en);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("旧 locale 首页不再承载模型内容", async ({ page }) => {
  for (const route of ["/en/", "/zh-CN/"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: "Kimi K3" })).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
});

test("语言选择器写入记忆并导航", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const header = page.locator("header");
  const trigger = page.getByRole("button", { name: "Language: English" });

  await expect(header.getByText("Language", { exact: true })).toHaveCount(0);
  await expect(trigger).toHaveText("");
  await expect(trigger.locator("svg")).toHaveCount(1);
  await trigger.click();

  const items = page.getByRole("menuitemradio");
  await expect(items).toHaveCount(6);
  for (const name of nativeNames) {
    await expect(page.getByRole("menuitemradio", { name })).toBeVisible();
  }
  await expect(page.getByRole("menuitemradio", { name: "English" })).toHaveAttribute("aria-checked", "true");

  await page.getByRole("menuitemradio", { name: "中文" }).click();
  await expect(page).toHaveURL(/\/zh-CN\/models\/kimi-k3\/$/);
  await expect(page.evaluate(() => localStorage.getItem("lang"))).resolves.toBe("zh-CN");
  const nextTrigger = page.getByRole("button", { name: "语言: 中文" });
  await expect(nextTrigger).toHaveText("");
  await expect(nextTrigger.locator("svg")).toHaveCount(1);
});

test("语言菜单支持键盘开启、导航与关闭", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const trigger = page.getByRole("button", { name: "Language: English" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitemradio", { name: "English" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitemradio", { name: "中文" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("canonical 与 hreflang 完整", async ({ page }) => {
  await page.goto(modelRoutes.en);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://aievalindex.vercel.app/models/kimi-k3/");
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(7);
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute("href", "https://aievalindex.vercel.app/zh-CN/models/kimi-k3/");
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", "https://aievalindex.vercel.app/models/kimi-k3/");
});

test("Header 与浏览器标签共享品牌图标", async ({ page }) => {
  await page.goto(modelRoutes.en);
  await expect(page.locator('header img[src="/aievalindex-mark.png"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/aievalindex-mark.png");
});

test("Hero 标题使用 Moonshot 模型厂商标记", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const hero = page.locator("#models");

  await expect(hero.locator('img[src="/model-logos/moonshot.svg"]')).toHaveCount(1);
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Kimi K3");
  await expect(hero.locator(".hero-model-lockup")).toHaveCSS("align-items", "baseline");
  await expect(hero.locator("dl")).toHaveCSS("text-align", "right");
  await expect(hero.locator("dl")).toHaveCSS("justify-items", "end");
});

test("指标卡在中等宽度保持两列，宽屏展开四列且标题区对齐", async ({ page }) => {
  await page.setViewportSize({ width: 876, height: 844 });
  await page.goto(modelRoutes.en);
  const stats = page.locator(".hero-stats");

  const mediumLayout = await stats.evaluate((grid) => {
    const cards = Array.from(grid.children) as HTMLElement[];
    return {
      columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
      headerHeights: cards.map((card) => card.querySelector<HTMLElement>(".hero-stat-header")!.offsetHeight),
      firstRowValueTops: cards.slice(0, 2).map((card) => card.querySelector<HTMLElement>(".stat-value")!.offsetTop),
    };
  });

  expect(mediumLayout.columns).toBe(2);
  expect(new Set(mediumLayout.headerHeights).size).toBe(1);
  expect(new Set(mediumLayout.firstRowValueTops).size).toBe(1);

  await page.setViewportSize({ width: 1280, height: 900 });
  const desktopLayout = await stats.evaluate((grid) => {
    const cards = Array.from(grid.children) as HTMLElement[];
    const badges = Array.from(grid.querySelectorAll<HTMLElement>(".stat-badge"));
    const bars = Array.from(grid.querySelectorAll<HTMLElement>(".stat-bar"));
    return {
      columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
      cardHeights: cards.map((card) => card.offsetHeight),
      cardRadii: cards.map((card) => getComputedStyle(card).borderRadius),
      labels: cards.map((card) => card.querySelector<HTMLElement>(".hero-stat-header div")!.textContent),
      units: Array.from(grid.querySelectorAll<HTMLElement>(".stat-unit")).map((unit) => unit.textContent),
      badgeColors: badges.map((badge) => getComputedStyle(badge).backgroundColor),
      barHeights: bars.map((bar) => bar.offsetHeight),
      barColors: bars.map((bar) => getComputedStyle(bar.firstElementChild!).backgroundColor),
    };
  });
  expect(desktopLayout.columns).toBe(4);
  expect(new Set(desktopLayout.cardHeights)).toEqual(new Set([136]));
  expect(new Set(desktopLayout.cardRadii)).toEqual(new Set(["8px"]));
  expect(desktopLayout.labels).toEqual(["Intelligence", "Output Speed", "Price / 1M", "Context"]);
  expect(desktopLayout.units).toEqual(["idx", "tokens/s", "tokens"]);
  expect(desktopLayout.badgeColors[0]).not.toBe(desktopLayout.badgeColors[1]);
  expect(desktopLayout.badgeColors[1]).toBe(desktopLayout.badgeColors[2]);
  expect(new Set(desktopLayout.barHeights)).toEqual(new Set([5]));
  expect(desktopLayout.barColors[0]).not.toBe(desktopLayout.barColors[1]);
});

test("Header 桌面端主导航指向真实页内区块", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(modelRoutes.en);
  const navigation = page.getByRole("navigation", { name: "Primary" });

  await expect(navigation.getByRole("button", { name: "Models: Kimi K3" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Leaderboard" })).toHaveAttribute("href", "#leaderboard");
  await expect(navigation.getByRole("link", { name: "Methodology" })).toHaveAttribute("href", "#methodology");
  await expect(page.locator("#models, #leaderboard, #methodology")).toHaveCount(3);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(navigation).toBeHidden();
});

test("Header 模型菜单按厂商分组并只链接已收录模型", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(modelRoutes.en);
  const trigger = page.getByRole("button", { name: "Models: Kimi K3" });
  await trigger.click();

  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("group")).toHaveCount(4);
  await expect(menu.getByRole("menuitem")).toHaveCount(10);
  await expect(menu.locator('[role="menuitem"][aria-disabled="true"]')).toHaveCount(9);
  await expect(menu.locator(`a[href="${modelRoutes.en}"][aria-current="page"]`)).toContainText("Kimi K3");
  await expect(menu.getByText("GPT-5.6", { exact: true })).toBeVisible();
  await expect(menu.getByText("Claude Opus 4.8", { exact: true })).toBeVisible();
  await expect(menu.getByText("Gemini 3.5 Flash", { exact: true })).toBeVisible();
  for (const logo of ["openai.svg", "claude-color.svg", "moonshot.svg", "gemini-color.svg"]) {
    await expect(menu.locator(`img[src="/model-logos/${logo}"]`)).toHaveCount(1);
  }

  const box = await menu.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(1280);
  await expect(menu.locator(".grid").first()).toHaveCSS("grid-template-columns", /\S+ \S+ \S+/);

  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(menu.locator(`a[href="${modelRoutes.en}"]`)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("Header 置顶、背景一致且品牌说明归入 Footer", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const description = "An independent, hand-curated index of frontier model evaluations — every number links back to its source.";
  const header = page.locator("header");
  const [headerBackground, bodyBackground] = await Promise.all([
    header.evaluate((element) => getComputedStyle(element).backgroundColor),
    page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor),
  ]);

  await expect(header).toHaveCSS("position", "sticky");
  await expect(header).toHaveCSS("top", "0px");
  expect(headerBackground).toBe(bodyBackground);
  await expect(header.getByText(description, { exact: true })).toHaveCount(0);
  await expect(page.locator("footer").getByText(description, { exact: true })).toBeVisible();
});

test("移动端仅跑分容器横向滚动", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(modelRoutes.en);
  const widths = await page.evaluate(() => {
    const scroller = document.querySelector<HTMLElement>(".benchmark-scroll");
    const tableHead = scroller?.querySelector("thead");
    const firstRow = scroller?.querySelector("tbody tr");
    return {
      body: document.documentElement.scrollWidth === document.documentElement.clientWidth,
      rowsDoNotOverlap: Boolean(
        tableHead && firstRow && tableHead.getBoundingClientRect().bottom <= firstRow.getBoundingClientRect().top + 1,
      ),
      table: Boolean(scroller && scroller.scrollWidth > scroller.clientWidth),
    };
  });
  expect(widths).toEqual({ body: true, rowsDoNotOverlap: true, table: true });
});

test("跑分表头滚动时吸附在全局 Header 下方", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto(modelRoutes.en);
  const header = page.locator("header");
  const tableHead = page.locator("#leaderboard thead");
  const benchmarkHeader = tableHead.getByRole("columnheader", { name: "Benchmark" });
  const modelHeader = tableHead.getByRole("columnheader", { name: "Kimi K3" });

  const tableHeadPageY = await tableHead.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  await page.evaluate((top) => window.scrollTo(0, top + 240), tableHeadPageY);

  const [headerBox, tableHeadBox] = await Promise.all([header.boundingBox(), tableHead.boundingBox()]);
  expect(headerBox).not.toBeNull();
  expect(tableHeadBox).not.toBeNull();
  expect(Math.abs(tableHeadBox!.y - (headerBox!.y + headerBox!.height))).toBeLessThanOrEqual(1);
  expect(await benchmarkHeader.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  expect(Number.parseFloat(await modelHeader.evaluate((element) => getComputedStyle(element).fontSize))).toBeGreaterThan(
    Number.parseFloat(await benchmarkHeader.evaluate((element) => getComputedStyle(element).fontSize)),
  );
});

test("跑分表以图标承载注释和来源", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const row = page.getByRole("row").filter({ hasText: "Intelligence Index v4.1" });
  const note = row.getByRole("button", { name: /Benchmark note:/ });

  await expect(row.getByText("#4/189", { exact: false })).not.toBeVisible();
  await note.hover();
  await expect(page.getByRole("tooltip")).toContainText("#4/189 · GPT-5.6 Sol = xhigh effort");
  await expect(row.getByRole("link", { name: "Intelligence Index v4.1" })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("columnheader", { name: "Source" })).toHaveCount(0);
});

test("跑分区使用比较标题并解释加粗规则", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const leaderboard = page.locator("#leaderboard");

  await expect(leaderboard.getByRole("heading", { level: 2 })).toHaveText("Kimi K3 vs. frontier anchors");
  await expect(leaderboard.getByText("Higher is better · best in row bold", { exact: true })).toBeVisible();
  await expect(leaderboard.locator("strong")).toHaveText("best in row bold");
  await expect(leaderboard.locator("strong")).toHaveCSS("font-weight", "700");
  await expect(leaderboard.locator(".benchmark-name").first()).toHaveCSS("top", "-2px");
});

test("跑分表只加粗每行最佳成绩", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const intelligence = page.getByRole("row").filter({ hasText: "Intelligence Index v4.1" });
  const programBench = page.getByRole("row").filter({ hasText: "Program Bench" });

  await expect(intelligence.getByRole("cell").nth(1)).not.toHaveAttribute("data-best");
  await expect(intelligence.getByRole("cell").nth(2)).toHaveAttribute("data-best", "true");
  await expect(programBench.getByRole("cell").nth(1)).toHaveAttribute("data-best", "true");
});

test("跑分表底部统计每个模型的胜出项", async ({ page }) => {
  await page.goto(modelRoutes.en);
  await expect(page.getByRole("row", { name: "Wins 4 3 4 0" })).toBeVisible();
});

test("跑分比较筛选同步更新可见列、最佳成绩与胜出项", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const leaderboard = page.locator("#leaderboard");
  const opus = leaderboard.getByRole("button", { name: "Opus 4.8", exact: true });
  const gpt = leaderboard.getByRole("button", { name: "GPT-5.6", exact: true });
  const fable = leaderboard.getByRole("button", { name: "Fable 5", exact: true });

  await expect(opus).toHaveAttribute("aria-pressed", "true");
  await opus.click();
  await gpt.click();
  await expect(opus).toHaveAttribute("aria-pressed", "false");
  await expect(leaderboard.getByRole("columnheader", { name: "Opus 4.8" })).toHaveCount(0);
  await expect(leaderboard.getByRole("columnheader", { name: "GPT-5.6" })).toHaveCount(0);
  await expect(leaderboard.getByRole("row", { name: "Wins 6 5" })).toBeVisible();

  const intelligence = leaderboard.getByRole("row").filter({ hasText: "Intelligence Index v4.1" });
  const programBench = leaderboard.getByRole("row").filter({ hasText: "Program Bench" });
  await expect(intelligence.getByRole("cell").nth(2)).toHaveAttribute("data-best", "true");
  await expect(programBench.getByRole("cell").nth(1)).toHaveAttribute("data-best", "true");

  await fable.click();
  await expect(leaderboard.getByRole("columnheader", { name: "Fable 5" })).toHaveCount(0);
  await expect(leaderboard.getByRole("row", { name: "Wins 11" })).toBeVisible();
  await expect(intelligence.getByRole("cell").nth(1)).toHaveAttribute("data-best", "true");
});

test("社区结论使用紧凑圆角评分分布与带分隔线双栏", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const verdict = page.locator("#community-verdict");

  await expect(verdict.getByText("Community Verdict", { exact: true })).toBeVisible();
  await expect(verdict.getByRole("heading", { level: 2 })).toHaveText("Admired, with caveats");
  await expect(verdict.getByRole("img", { name: "3.8 / 5 · 1 rave, 5 mixed, 0 critical" })).toBeVisible();
  await expect(verdict.getByText("Frontier-tier, and open", { exact: true })).toBeVisible();
  await expect(verdict.getByText("Weights not out yet", { exact: true })).toBeVisible();
  await expect(verdict.getByRole("navigation", { name: "Review sources" })).toHaveCount(0);
  await expect(verdict.locator(".verdict-score")).toHaveCSS("border-radius", "6px");
  await expect(verdict.locator(".verdict-score-summary")).toHaveCSS("translate", "0px 2px");
  expect(await verdict.locator("li").evaluateAll((items) => items.every((item) => getComputedStyle(item).borderBottomWidth === "1px"))).toBe(true);
  await expect(verdict.locator("article")).toHaveCount(0);
});

test("社区原声流使用三列小圆角平台卡片与正负双色高亮", async ({ page }) => {
  await page.setViewportSize({ width: 875, height: 814 });
  await page.goto(modelRoutes.en);
  const feed = page.locator("#community-reviews");

  await expect(feed.getByRole("heading", { level: 2 })).toHaveText("Straight from the feed");
  await expect(feed.locator("article")).toHaveCount(4);
  expect(await feed.locator("article").evaluateAll((cards) => cards.every((card) => getComputedStyle(card).borderRadius === "4px"))).toBe(true);
  await expect(feed.locator(".review-grid")).toHaveCSS("grid-template-columns", /\S+ \S+ \S+/);
  await expect(feed.locator('mark[data-tone="positive"]')).not.toHaveCount(0);
  await expect(feed.locator('mark[data-tone="negative"]')).not.toHaveCount(0);
  await expect(feed.locator('img[src="/kimi-k3-review-video-editorial.png"]')).toHaveCount(1);
  const order = await feed.locator("article").evaluateAll((cards) => cards.map((card) => card.textContent ?? ""));
  expect(order[0]).toContain("Simon Willison");
  expect(order[1]).toContain("AIReiter");
  expect(order[2]).toContain("Peter");
  expect(order[3]).toContain("Lentils");
  expect(await feed.locator("article").nth(3).evaluate((card) => getComputedStyle(card).gridColumnStart)).toBe("2");
  await expect(feed.getByRole("link", { name: "Read article" })).toHaveCount(2);
  await expect(feed.getByRole("link", { name: "Open Lentils on X" })).toHaveAttribute("href", "https://x.com/Lentils80/status/2077387333154857151");
  await expect(feed.getByRole("link", { name: /Watch video: Peter/ })).toHaveAttribute("href", "https://www.youtube.com/watch?v=LSlV206xPqM");
});

test("社区原声流在移动端回落单列且不产生页面横向滚动", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(modelRoutes.en);
  const feed = page.locator("#community-reviews");

  await expect(feed.locator(".review-grid")).toHaveCSS("grid-template-columns", "350px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);
});

test("页脚使用品牌说明、真实页内导航与数据来源元信息", async ({ page }) => {
  await page.goto(modelRoutes.en);
  const footer = page.getByRole("contentinfo");
  const footerPrimary = footer.locator(".footer-primary");
  const main = page.locator("main");

  await expect(footer.getByRole("link", { name: "AIEvalIndex" })).toHaveAttribute("href", "/");
  await expect(footer.getByText("An independent, hand-curated index of frontier model evaluations — every number links back to its source.", { exact: true })).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "Explore" }).getByRole("link")).toHaveCount(4);
  await expect(footer.getByRole("link", { name: "Reviews" })).toHaveAttribute("href", "#community-reviews");
  await expect(footer.getByRole("navigation", { name: "About" }).getByRole("link")).toHaveCount(2);
  await expect(footer.getByRole("link", { name: "Artificial Analysis" })).toHaveAttribute("href", "https://artificialanalysis.ai/models/kimi-k3");
  await expect(footer.getByText("© 2026 AI Eval Index", { exact: true })).toBeVisible();
  const [mainBox, footerBox] = await Promise.all([main.boundingBox(), footerPrimary.boundingBox()]);
  expect(footerBox?.x).toBeCloseTo(mainBox?.x ?? 0, 0);
  expect(footerBox?.width).toBeCloseTo(mainBox?.width ?? 0, 0);
  expect(await footer.getByRole("link", { name: "Models" }).evaluate((link) => getComputedStyle(link).fontFamily)).toContain("Newsreader");
  await expect(footer.locator(".footer-primary-grid")).toHaveCSS("grid-template-columns", /.+ .+ .+/);
});

test("页脚在移动端顺序堆叠并保持正文版心", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(modelRoutes.en);
  const footer = page.getByRole("contentinfo");

  await expect(footer.locator(".footer-primary-grid")).toHaveCSS("grid-template-columns", "350px");
  await expect(footer.locator(".footer-meta")).toHaveCSS("grid-template-columns", "350px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);
});
