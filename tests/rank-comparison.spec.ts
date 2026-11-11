import { expect, test } from "@playwright/test";

const routes = [
  { path: "/scenarios/web-frontend/", chart: "Rank chart", table: "Full table", range: "Compare", missing: "Not on this board", clear: "Clear selection" },
  { path: "/zh/scenarios/web-frontend/", chart: "排名曲线", table: "完整表格", range: "对比范围", missing: "未上榜", clear: "清除选择" },
];

for (const route of routes) {
  test(`rank comparison preserves source results and missing boards: ${route.path}`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await expect(page.getByRole("button", { name: route.chart, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("[data-rank-model]")).toHaveCount(15);
    await expect(page.locator("[data-rank-column]")).toHaveCount(7);
    await expect(page.locator("[data-fused-head]")).toHaveCount(0);

    const opus = page.locator('[data-rank-series="model:claude-opus-5-5"]');
    await expect(opus.locator('[data-rank-point="3"]')).toHaveCount(0);
    const curve = await opus.locator("path").nth(1).getAttribute("d");
    expect(curve?.match(/M /g)).toHaveLength(2);

    const model = page.getByRole("button", { name: "Claude Opus 5.5", exact: true });
    await model.press("Enter");
    await expect(model).toHaveAttribute("aria-pressed", "true");
    const detail = page.locator("[data-rank-detail]");
    await expect(detail).toBeVisible();
    await expect(detail.getByText("1810", { exact: true })).toBeVisible();
    await expect(detail.getByText(route.missing, { exact: true })).toHaveCount(1);
    await model.press("Escape");
    await expect(detail).toHaveCount(0);

    await page.getByRole("combobox", { name: route.range, exact: true }).selectOption("20");
    await expect(page.locator("[data-rank-model]")).toHaveCount(20);
    const qwen = page.locator('[data-rank-series="model:qwen3-8-max"] [data-rank-point="2"]');
    const kimi = page.locator('[data-rank-series="model:kimi-k3-1-pro"] [data-rank-point="2"]');
    expect(await qwen.getAttribute("data-source-rank")).toBe("6");
    expect(await kimi.getAttribute("data-rank")).toBe(await qwen.getAttribute("data-rank"));
    expect(await kimi.locator("circle").first().getAttribute("cy")).toBe(await qwen.locator("circle").first().getAttribute("cy"));
    expect(await kimi.locator("circle").first().getAttribute("cx")).not.toBe(await qwen.locator("circle").first().getAttribute("cx"));

    const data = await page.locator("[data-rank-series]").evaluateAll((series) => series.map((item) => ({
      model: item.getAttribute("data-rank-series"),
      ranks: [...item.querySelectorAll("[data-rank-point]")].map((point) => ({ column: point.getAttribute("data-rank-point"), group: point.getAttribute("data-rank"), source: point.getAttribute("data-source-rank") })),
    })));
    await testInfo.attach("rank-source-results.json", { body: JSON.stringify(data, null, 2), contentType: "application/json" });

    await page.getByRole("combobox", { name: route.range, exact: true }).selectOption("10");
    await expect(page.locator("[data-rank-model]")).toHaveCount(10);
    await page.getByRole("button", { name: route.table, exact: true }).click();
    await expect(page.locator("[data-fused-head] th")).toHaveCount(10);
    await expect(page.locator("[data-fused-scroll] tbody tr")).toHaveCount(20);
    const firstRow = page.locator("[data-fused-scroll] tbody tr").first();
    await expect(firstRow).toContainText("Claude Opus 5.5");
    await expect(firstRow.locator("td").nth(6)).toHaveText("—");
    await page.getByRole("button", { name: route.chart, exact: true }).click();
    await expect(page.locator("[data-rank-model]")).toHaveCount(15);
  });

  test(`rank comparison fits mobile and keeps model labels visible: ${route.path}`, async ({ page }, testInfo) => {
    const metrics = [];
    for (const width of [390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route.path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      const scroll = page.locator("[data-rank-scroll]");
      const first = page.locator("[data-rank-model]").first();
      const before = await first.boundingBox();
      await scroll.evaluate((el) => { el.scrollLeft = 300; });
      const after = await first.boundingBox();
      expect(Math.abs(before!.x - after!.x)).toBeLessThanOrEqual(1);
      const dimensions = await scroll.evaluate((el) => ({ width: el.clientWidth, content: el.scrollWidth, offset: el.scrollLeft }));
      if (width < 1280) expect(dimensions.offset).toBeGreaterThan(0);
      metrics.push({ viewport: width, ...dimensions, labelX: after!.x });
    }
    await testInfo.attach("responsive-layout.json", { body: JSON.stringify(metrics, null, 2), contentType: "application/json" });
  });
}

test("chart links open source boards and the selected model", async ({ page }) => {
  await page.goto("/scenarios/web-frontend/");
  await page.locator("[data-rank-column]").first().click();
  await expect(page).toHaveURL(/\/benchmarks\/lmarena-webdev\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("LMArena WebDev");
  await page.goBack();
  await page.getByRole("button", { name: "Claude Opus 5.5", exact: true }).click();
  await page.getByRole("link", { name: "Model details", exact: true }).click();
  await expect(page).toHaveURL(/\/models\/claude-opus-5-5\/$/);
});
