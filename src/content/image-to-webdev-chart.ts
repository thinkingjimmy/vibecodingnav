/**
 * [INPUT]: 依赖 Image-to-WebDev 的逐行副本
 * [OUTPUT]: 对外提供帕累托页的分数–价格点：混合价 (输入 + 3×输出) / 4
 * [POS]: src/content 的图生网页散点，基准页只读这里
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Locale } from "@/lib/contracts";
import rows from "./boards/image-to-webdev.json";

interface ChartRow {
  label: string;
  score: number;
  blend?: number;
  pareto?: boolean;
  paretoPrice?: string;
}

export function imageToWebdevChart(locale: Locale) {
  const points = (rows as ChartRow[])
    .filter((row): row is ChartRow & { blend: number } => row.blend != null)
    .map((row) => ({
      name: row.label,
      score: row.score,
      price: row.blend,
      priceLabel: row.paretoPrice ?? "",
      pareto: Boolean(row.pareto),
    }));
  return {
    title: locale === "zh" ? "分数与价格" : "Score and price",
    note: locale === "zh"
      ? "横轴是帕累托页的混合价格 (输入 + 3×输出) / 4，单位 $/M。纵轴是榜上的分数。实心点是该页列出的 6 个最优点，价格用页面上的写法。"
      : "The horizontal axis is the Pareto page’s blended price, (input + 3×output) / 4, in $/M. The vertical axis is the board score. Filled points are the six models that page lists, with the prices printed there.",
    href: "https://arena.ai/leaderboard/code/image-to-webdev/pareto",
    hrefLabel: "arena.ai/leaderboard/code/image-to-webdev/pareto",
    points,
  };
}
