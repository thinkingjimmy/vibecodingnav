/* 浏览器验收：六语言路由、品牌一致性、语言菜单、SEO、响应式与视觉回归 */
import { expect, test } from "@playwright/test";

const locales = ["en", "zh-CN", "ja", "ko", "es", "fr"] as const;
const nativeNames = ["English", "中文", "日本語", "한국어", "Español", "Français"] as const;

const cases = [
  { name: "en-desktop", locale: "en", viewport: { width: 1280, height: 900 } },
  { name: "zh-desktop", locale: "zh-CN", viewport: { width: 1280, height: 900 } },
  { name: "en-mobile", locale: "en", viewport: { width: 390, height: 844 } },
  { name: "zh-mobile", locale: "zh-CN", viewport: { width: 390, height: 844 } },
] as const;

for (const current of cases) {
  test(`visual ${current.name}`, async ({ browser }) => {
    const page = await browser.newPage({ viewport: current.viewport });
    await page.goto(`/${current.locale}/`);
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
    await page.goto("/en/");
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

for (const locale of locales) {
  test(`${locale} 静态页面可达`, async ({ page }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kimi K3");
  });
}

test("根路径优先使用 localStorage", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("lang", "fr"));
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr\/$/);
});

test("根路径归并浏览器中文地区", async ({ browser }) => {
  const context = await browser.newContext({ locale: "zh-TW" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/zh-CN\/$/);
  await context.close();
});

test("语言选择器写入记忆并导航", async ({ page }) => {
  await page.goto("/en/");
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
  await expect(page).toHaveURL(/\/zh-CN\/$/);
  await expect(page.evaluate(() => localStorage.getItem("lang"))).resolves.toBe("zh-CN");
  const nextTrigger = page.getByRole("button", { name: "语言: 中文" });
  await expect(nextTrigger).toHaveText("");
  await expect(nextTrigger.locator("svg")).toHaveCount(1);
});

test("语言菜单支持键盘开启、导航与关闭", async ({ page }) => {
  await page.goto("/en/");
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
  await page.goto("/en/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://aievalindex.vercel.app/en/");
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(7);
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", "https://aievalindex.vercel.app/en/");
});

test("Header 与浏览器标签共享品牌图标", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator('header img[src="/aievalindex-mark.png"]')).toHaveCount(1);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/aievalindex-mark.png");
});

test("Hero 标题使用 Moonshot 模型厂商标记", async ({ page }) => {
  await page.goto("/en/");
  const hero = page.locator("#models");

  await expect(hero.locator('img[src="/moonshot.svg"]')).toHaveCount(1);
  await expect(hero.getByRole("heading", { level: 1 })).toHaveText("Kimi K3");
  await expect(hero.locator(".hero-model-lockup")).toHaveCSS("align-items", "baseline");
});

test("指标卡在中等宽度保持两列，宽屏展开四列且标题区对齐", async ({ page }) => {
  await page.setViewportSize({ width: 876, height: 844 });
  await page.goto("/en/");
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
  const desktopColumns = await stats.evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length);
  expect(desktopColumns).toBe(4);
});

test("Header 桌面端主导航指向真实页内区块", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/en/");
  const navigation = page.getByRole("navigation", { name: "Primary" });

  await expect(navigation.getByRole("link", { name: "Models" })).toHaveAttribute("href", "#models");
  await expect(navigation.getByRole("link", { name: "Leaderboard" })).toHaveAttribute("href", "#leaderboard");
  await expect(navigation.getByRole("link", { name: "Methodology" })).toHaveAttribute("href", "#methodology");
  await expect(page.locator("#models, #leaderboard, #methodology")).toHaveCount(3);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(navigation).toBeHidden();
});

test("Header 置顶、背景一致且品牌说明归入 Footer", async ({ page }) => {
  await page.goto("/en/");
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
  await page.goto("/en/");
  const widths = await page.evaluate(() => {
    const scroller = document.querySelector<HTMLElement>(".benchmark-scroll");
    return {
      body: document.documentElement.scrollWidth === document.documentElement.clientWidth,
      table: Boolean(scroller && scroller.scrollWidth > scroller.clientWidth),
    };
  });
  expect(widths).toEqual({ body: true, table: true });
});

test("跑分表头滚动时吸附在全局 Header 下方", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 700 });
  await page.goto("/en/");
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
  await page.goto("/en/");
  const row = page.getByRole("row").filter({ hasText: "Intelligence Index v4.1" });
  const note = row.getByRole("button", { name: /Benchmark note:/ });

  await expect(row.getByText("#4/189", { exact: false })).not.toBeVisible();
  await note.hover();
  await expect(page.getByRole("tooltip")).toContainText("#4/189 · GPT-5.6 Sol = xhigh effort");
  await expect(row.getByRole("link", { name: "Open source: Artificial Analysis" })).toHaveAttribute("target", "_blank");
  await expect(page.getByRole("columnheader", { name: "Source" })).toHaveCount(0);
});

test("跑分区使用比较标题并解释加粗规则", async ({ page }) => {
  await page.goto("/en/");
  const leaderboard = page.locator("#leaderboard");

  await expect(leaderboard.getByRole("heading", { level: 2 })).toHaveText("Kimi K3 vs. frontier anchors");
  await expect(leaderboard.getByText("Higher is better · best in row bold", { exact: true })).toBeVisible();
});

test("跑分表只加粗每行最佳成绩", async ({ page }) => {
  await page.goto("/en/");
  const intelligence = page.getByRole("row").filter({ hasText: "Intelligence Index v4.1" });
  const programBench = page.getByRole("row").filter({ hasText: "Program Bench" });

  await expect(intelligence.getByRole("cell").nth(1)).not.toHaveAttribute("data-best");
  await expect(intelligence.getByRole("cell").nth(2)).toHaveAttribute("data-best", "true");
  await expect(programBench.getByRole("cell").nth(1)).toHaveAttribute("data-best", "true");
});

test("跑分表底部统计每个模型的胜出项", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.getByRole("row", { name: "Wins 4 3 4 0" })).toBeVisible();
});

test("社区结论使用评分分布、精简双栏与来源回链", async ({ page }) => {
  await page.goto("/en/");
  const verdict = page.locator("#community-verdict");

  await expect(verdict.getByText("Community Verdict", { exact: true })).toBeVisible();
  await expect(verdict.getByRole("heading", { level: 2 })).toHaveText("Admired, with caveats");
  await expect(verdict.getByRole("img", { name: "3.8 / 5 · 1 rave, 5 mixed, 0 critical" })).toBeVisible();
  await expect(verdict.getByText("Frontier-tier, and open", { exact: true })).toBeVisible();
  await expect(verdict.getByText("Weights not out yet", { exact: true })).toBeVisible();
  await expect(verdict.getByRole("navigation", { name: "Review sources" }).getByRole("link")).toHaveCount(4);
  await expect(verdict.locator("article")).toHaveCount(0);
});

test("页脚使用品牌说明、真实页内导航与数据来源元信息", async ({ page }) => {
  await page.goto("/en/");
  const footer = page.getByRole("contentinfo");

  await expect(footer.getByRole("link", { name: "AIEvalIndex" })).toHaveAttribute("href", "/en/");
  await expect(footer.getByText("An independent, hand-curated index of frontier model evaluations — every number links back to its source.", { exact: true })).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "Explore" }).getByRole("link")).toHaveCount(4);
  await expect(footer.getByRole("navigation", { name: "About" }).getByRole("link")).toHaveCount(2);
  await expect(footer.getByRole("link", { name: "Artificial Analysis" })).toHaveAttribute("href", "https://artificialanalysis.ai/models/kimi-k3");
  await expect(footer.getByText("© 2026 AI Eval Index", { exact: true })).toBeVisible();
});
