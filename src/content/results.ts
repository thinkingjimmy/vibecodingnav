/**
 * [INPUT]: 依赖 Result 契约与设计稿中的榜单行
 * [OUTPUT]: 对外提供按基准存放的成绩，名次与分数只在这里出现一次
 * [POS]: src/content 的成绩表，场景页与模型页都从这里读
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Ci, Result, VendorId, WeightClass } from "@/lib/contracts";
import android1 from "./boards/android-1.json";
import androidLong from "./boards/android-long.json";
import deepsweRows from "./boards/deepswe.json";
import sudoRows from "./boards/sudo.json";
import terminalRows from "./boards/terminal.json";
import imageToWebdevRows from "./boards/image-to-webdev.json";
import webdevRows from "./boards/webdev.json";
import slopIndexRows from "./boards/slop-index.json";

interface BoardJson {
  rank: number;
  label: string;
  modelSlug?: string;
  effort?: string;
  vendor?: VendorId;
  letter?: string;
  org?: string;
  licenseText?: string;
  weights?: WeightClass;
  agent?: string;
  agentOrg?: string;
  score: number;
  scoreText: string;
  ciText?: string;
  ciPm?: number;
  ciLow?: number;
  ciHigh?: number;
  rankSpread?: string;
  votes?: string;
  tokenPrice?: string;
  runCost?: string;
  context?: string;
  completion?: string;
  latency?: string;
  tokens?: string;
  releaseDate?: string;
  preliminary?: boolean;
}

function displayedScore(row: BoardJson) {
  if (row.scoreText.includes("%")) {
    const match = row.scoreText.match(/[\d.]+/);
    if (match) return Number(match[0]);
  }
  return row.score;
}

function boardCi(row: BoardJson): Ci | undefined {
  if (row.ciPm != null) return { kind: "pm", value: row.ciPm };
  if (row.ciLow != null && row.ciHigh != null) return { kind: "range", low: row.ciLow, high: row.ciHigh };
  return undefined;
}

function board(benchmark: string, asOf: string, rows: BoardJson[], version?: string): Result[] {
  return rows.map((row) => ({
    benchmark,
    asOf,
    version,
    rank: row.rank,
    rankSpread: row.rankSpread,
    modelSlug: row.modelSlug,
    label: row.label,
    vendor: row.vendor,
    letter: row.letter,
    org: row.org,
    licenseText: row.licenseText,
    weights: row.weights,
    agent: row.agent,
    agentOrg: row.agentOrg,
    effort: row.effort,
    setting: [row.effort, row.agent].filter(Boolean).join(" · ") || undefined,
    score: displayedScore(row),
    scoreText: row.scoreText,
    ci: boardCi(row),
    ciText: row.ciText,
    votes: row.votes,
    tokenPrice: row.tokenPrice,
    runCost: row.runCost,
    context: row.context,
    completion: row.completion,
    latency: row.latency,
    tokens: row.tokens,
    releaseDate: row.releaseDate,
    preliminary: row.preliminary || undefined,
  }));
}

function fw(
  benchmark: string,
  asOf: string,
  modelSlug: string,
  score: number,
  extra: Partial<Result> = {},
): Result {
  return { benchmark, asOf, modelSlug, score, arm: extra.arm ?? "baseline", ...extra };
}

function reactBench(): Result[] {
  const rows: [number, string, number, string, number, number, string][] = [
    [1, "claude-fable-5-1", 49.2, "max", 47.4, 51.1, "$5.50"],
    [2, "gpt-5-6-sol", 46.7, "max", 41.5, 51.8, "$3.06"],
    [3, "claude-fable-5-1", 46.2, "xhigh", 42.6, 49.7, "$3.74"],
    [4, "claude-fable-5", 44.6, "max", 42.1, 47.2, "$12.76"],
    [5, "claude-fable-5-1", 44.1, "high", 42.2, 46.0, "$1.74"],
    [6, "claude-fable-5", 43.1, "xhigh", 36.6, 49.5, "$9.17"],
    [7, "claude-opus-5", 42.1, "max", 38.6, 45.5, "$5.94"],
    [8, "claude-opus-5", 41.5, "high", 35.7, 47.4, "$3.68"],
    [9, "gpt-5-6-sol", 41.0, "xhigh", 36.8, 45.2, "$2.02"],
    [10, "claude-fable-5", 40.5, "high", 38.6, 42.4, "$6.80"],
    [11, "gpt-5-6-terra", 39.0, "max", 36.5, 41.4, "$1.13"],
    [12, "gpt-5-6-terra", 37.4, "high", 34.9, 40.0, "$0.40"],
    [13, "gpt-5-6-sol", 36.9, "high", 34.9, 38.9, "$1.58"],
    [14, "gpt-5-6-terra", 36.9, "xhigh", 33.5, 40.3, "$0.60"],
    [15, "qwen3-8-max", 36.4, "xhigh", 31.5, 41.3, "$1.62"],
    [16, "claude-opus-5", 36.4, "xhigh", 32.1, 40.7, "$4.93"],
    [18, "claude-fable-5", 35.4, "low", 31.1, 39.7, "$3.05"],
    [19, "deepseek-v4-1-flash", 35.4, "max", 29.4, 41.4, "$0.27"],
    [20, "gpt-5-6-sol", 34.9, "medium", 29.0, 40.7, "$1.10"],
    [22, "claude-opus-5", 34.4, "medium", 30.3, 38.4, "$2.04"],
    [23, "gemini-3-8-flash", 34.4, "max", 30.3, 38.4, "$1.63"],
    [24, "claude-fable-5-1", 33.8, "medium", 32.8, 34.9, "$1.12"],
    [28, "gpt-5-6-luna", 33.8, "max", 30.5, 37.2, "$0.84"],
    [29, "gpt-5-6-sol", 33.8, "low", 30.2, 37.5, "$0.59"],
    [30, "kimi-k3", 33.3, "", 26.4, 40.3, "$1.92"],
    [31, "claude-fable-5-1", 32.8, "low", 26.6, 39.1, "$0.84"],
    [34, "claude-sonnet-5", 32.3, "xhigh", 28.9, 35.7, "$3.17"],
    [36, "gpt-5-6-luna", 32.3, "high", 28.2, 36.4, "$0.38"],
    [38, "claude-sonnet-5", 31.3, "max", 29.4, 33.2, "$4.74"],
    [39, "gpt-5-6-luna", 31.3, "xhigh", 25.9, 36.6, "$0.57"],
    [42, "glm-5-3", 30.8, "max", 29.2, 32.4, "$2.25"],
    [43, "claude-sonnet-5", 30.3, "high", 27.8, 32.7, "$2.31"],
    [45, "gpt-5-6-terra", 29.7, "medium", 27.2, 32.3, "$0.25"],
    [49, "gpt-5-6-terra", 28.2, "low", 25.5, 31.0, "$0.21"],
    [51, "claude-opus-5", 27.2, "low", 23.8, 30.6, "$1.19"],
    [53, "glm-5-2", 27.2, "max", 22.8, 31.6, "$1.23"],
    [54, "gemini-3-1-pro", 25.6, "high", 22.9, 28.4, "$0.80"],
    [59, "kimi-k2-7-code", 23.6, "", 20.3, 26.9, "$1.27"],
    [60, "gemini-3-1-pro", 23.1, "xhigh", 20.3, 25.8, "$0.80"],
    [62, "claude-sonnet-5", 22.6, "medium", 19.2, 25.9, "$1.44"],
    [65, "gemini-3-1-pro", 22.1, "max", 18.3, 25.8, "$0.84"],
    [67, "gemini-3-1-pro", 21.5, "medium", 18.5, 24.6, "$0.84"],
    [70, "gpt-5-6-luna", 20.0, "medium", 15.7, 24.3, "$0.15"],
    [72, "cursor-composer-2-5", 17.4, "", 13.7, 21.1, "$0.14"],
    [73, "claude-sonnet-5", 16.9, "low", 13.9, 19.9, "$0.74"],
    [74, "gemini-3-1-pro", 12.8, "low", 6.7, 19.0, "$0.37"],
    [75, "gpt-5-6-luna", 10.8, "low", 7.1, 14.5, "$0.066"],
  ];
  return rows.map(([rank, modelSlug, score, effort, low, high, runCost]) => fw("reactbench", "2026-10-10", modelSlug, score, {
    rank,
    effort: effort || undefined,
    setting: effort || undefined,
    runCost,
    ci: { kind: "range", low, high },
  }));
}

export const results: Result[] = [
  ...board("lmarena-webdev", "2026-10-08", webdevRows as BoardJson[]),
  ...board("lmarena-image-to-webdev", "2026-10-09", imageToWebdevRows as BoardJson[]),
  ...board("terminal-bench-4", "2026-10-06", terminalRows as BoardJson[]),
  ...board("slop-index", "2026-10-11", slopIndexRows as BoardJson[]),
  ...board("sudo-l7", "2026-10-09", sudoRows as BoardJson[]),
  ...board("deepswe-v1-1", "2026-09-22", deepsweRows as BoardJson[]),
  ...board("android-bench", "2026-10-06", androidLong as BoardJson[], "2.0"),
  ...board("android-bench", "2026-10-06", android1 as BoardJson[], "1.0"),
  fw("supabase-evals", "2026-10-10", "claude-opus-5-5", 91.3, { rank: 1, effort: "high", setting: "high · Claude Code" }),
  fw("supabase-evals", "2026-10-10", "kimi-k3", 84.1, { rank: 2, setting: "OpenCode" }),
  fw("supabase-evals", "2026-10-10", "grok-4-7", 78.3, { rank: 3, effort: "high", setting: "high · Grok" }),
  fw("supabase-evals", "2026-10-10", "gpt-6-sol", 78.3, { rank: 4, effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-10", "claude-sonnet-5", 75.4, { rank: 5, effort: "high", setting: "high · Claude Code" }),
  fw("supabase-evals", "2026-10-10", "gpt-6-luna", 63.8, { rank: 6, effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-10", "claude-opus-5-5", 89.9, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("supabase-evals", "2026-10-10", "kimi-k3", 87, { arm: "assisted", setting: "OpenCode" }),
  fw("supabase-evals", "2026-10-10", "grok-4-7", 89.9, { arm: "assisted", effort: "high", setting: "high · Grok" }),
  fw("supabase-evals", "2026-10-10", "gpt-6-sol", 78.3, { arm: "assisted", effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-10", "claude-sonnet-5", 79.7, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("supabase-evals", "2026-10-10", "gpt-6-luna", 75.4, { arm: "assisted", effort: "medium", setting: "medium · Codex" }),
  fw("nextjs-evals", "2026-09-25", "claude-opus-5-5", 97, { rank: 1, effort: "high", setting: "high · Claude Code", runCost: "$0.234" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-sol", 97, { rank: 2, effort: "high", setting: "high · Codex", runCost: "$0.244" }),
  fw("nextjs-evals", "2026-09-25", "claude-fable-5-1", 97, { rank: 3, effort: "high", setting: "high · Claude Code", runCost: "$0.722" }),
  fw("nextjs-evals", "2026-09-25", "grok-4-7", 94, { rank: 4, setting: "OpenCode", runCost: "$0.109" }),
  fw("nextjs-evals", "2026-09-25", "gemini-3-8-flash", 90, { rank: 6, setting: "OpenCode", runCost: "$0.605" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-astra", 90, { rank: 7, effort: "high", setting: "high · Codex", runCost: "$0.891" }),
  fw("nextjs-evals", "2026-09-25", "kimi-k3", 84, { rank: 8, setting: "OpenCode", runCost: "$0.281" }),
  fw("nextjs-evals", "2026-09-25", "glm-5-2", 81, { rank: 9, setting: "OpenCode", runCost: "$0.152" }),
  fw("nextjs-evals", "2026-09-25", "claude-sonnet-5", 81, { rank: 10, setting: "Claude Code", runCost: "$0.386" }),
  fw("nextjs-evals", "2026-09-25", "cursor-composer-2-5", 81, { rank: 11, setting: "Cursor", runCost: "$0.062" }),
  fw("nextjs-evals", "2026-09-25", "minimax-m3", 81, { rank: 12, setting: "OpenCode", runCost: "$0.053" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-luna", 77, { rank: 13, effort: "high", setting: "high · Codex", runCost: "$0.011" }),
  fw("nextjs-evals", "2026-09-25", "kimi-k2-7-code", 74, { rank: 14, setting: "OpenCode", runCost: "$0.139" }),
  fw("nextjs-evals", "2026-09-25", "claude-opus-5-5", 97, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-sol", 97, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-09-25", "claude-fable-5-1", 97, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("nextjs-evals", "2026-09-25", "grok-4-7", 94, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-09-25", "gemini-3-8-flash", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-astra", 97, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-09-25", "kimi-k3", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-09-25", "glm-5-2", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-09-25", "claude-sonnet-5", 97, { arm: "assisted", setting: "Claude Code" }),
  fw("nextjs-evals", "2026-09-25", "cursor-composer-2-5", 94, { arm: "assisted", setting: "Cursor" }),
  fw("nextjs-evals", "2026-09-25", "minimax-m3", 90, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-09-25", "gpt-6-luna", 87, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-09-25", "kimi-k2-7-code", 90, { arm: "assisted", setting: "OpenCode" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 90.18, { rank: 1, runCost: "$3.64", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 88.39, { rank: 2, runCost: "$1.21", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 84.82, { rank: 3, runCost: "$1.42", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 80.36, { rank: 4, runCost: "$4.53", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-7", 80.36, { rank: 5, runCost: "$4.65", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 74.55, { rank: 6, runCost: "$0.16", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "gemini-3-1-pro", 72.32, { rank: 7, runCost: "$3.99", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 67.86, { rank: 8, runCost: "$0.08", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 66.07, { rank: 9, runCost: "$0.16", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gemini-3-8-flash", 64.29, { rank: 10, runCost: "$2.40", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-pro", 54.46, { rank: 11, runCost: "$0.40", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-flash", 48.21, { rank: 12, runCost: "$0.10", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 42.86, { rank: 13, runCost: "$0.45", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 96.43, { arm: "web", runCost: "$5.98", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 91.96, { arm: "web", runCost: "$1.82", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 84.82, { arm: "web", runCost: "$1.62", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 83.93, { arm: "web", runCost: "$6.61", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 79.02, { arm: "web", runCost: "$0.31", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 75, { arm: "web", runCost: "$0.65", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 67.86, { arm: "web", runCost: "$0.27", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 39.29, { arm: "web", runCost: "$0.47", setting: "1 run" }),
  ...reactBench(),
];
