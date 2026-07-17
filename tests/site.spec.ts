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
