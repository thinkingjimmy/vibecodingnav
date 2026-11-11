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
      ? "横轴是榜上 Price $/M 按 (输入 + 3×输出) / 4 算出的混合价，单位 $/M。纵轴是榜上的分数。实心点是帕累托页列出的 6 个模型。该页印的是单任务成本：Opus 5.5 Max $7.41，Sonnet 5.5 xHigh $2.35，GPT-6 Sol Max $1.85，Muse Spark 1.3 Max $1.20，DeepSeek-V4.1-Flash-20260910 Max $0.06，MiMo-V2.6-Flash $0.05。主榜 Cost/Task (P50) 在本次可读抓取中没有数值，所以散点不用单任务成本。该页另有 9 个模型因缺少成本数据没有画上。"
      : "The horizontal axis is the blended token price from the board’s Price $/M column, (input + 3×output) / 4, in $/M. The vertical axis is the board score. Filled points are the six models on the Pareto page. That page prints cost per task: Opus 5.5 Max $7.41, Sonnet 5.5 xHigh $2.35, GPT-6 Sol Max $1.85, Muse Spark 1.3 Max $1.20, DeepSeek-V4.1-Flash-20260910 Max $0.06, MiMo-V2.6-Flash $0.05. The main table’s Cost/Task (P50) column had no values in this readable fetch, so the plot does not use cost per task. That page also leaves nine models unplotted for lack of cost data.",
    href: "https://arena.ai/leaderboard/code/image-to-webdev/pareto",
    hrefLabel: "arena.ai/leaderboard/code/image-to-webdev/pareto",
    points,
  };
}
