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
import frontiercodeRows from "./boards/frontiercode.json";
import sudoRows from "./boards/sudo.json";
import terminalRows from "./boards/terminal.json";
import imageToWebdevRows from "./boards/image-to-webdev.json";
import webdevRows from "./boards/webdev.json";
import slopIndexRows from "./boards/slop-index.json";
import eqbenchCreativeWritingRows from "./boards/eqbench-creative-writing.json";

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
  passRate?: string;
  flagRate?: string;
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
    passRate: row.passRate,
    flagRate: row.flagRate,
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
    [1, "claude-opus-5-5", 54.4, "max", 49.5, 59.2, "$5.64"],
    [2, "claude-opus-5-5", 50.8, "xhigh", 48.9, 52.6, "$1.62"],
    [3, "claude-fable-5-1", 49.2, "max", 47.4, 51.1, "$5.50"],
    [4, "gpt-5-6-sol", 46.7, "max", 41.5, 51.8, "$3.06"],
    [5, "claude-fable-5-1", 46.2, "xhigh", 42.6, 49.7, "$3.74"],
    [6, "claude-opus-5-5", 46.2, "high", 43.0, 49.3, "$0.67"],
    [7, "claude-fable-5", 44.6, "max", 42.1, 47.2, "$12.76"],
    [8, "claude-fable-5-1", 44.1, "high", 42.2, 46.0, "$1.74"],
    [9, "claude-opus-5-5", 43.6, "medium", 38.6, 48.6, "$0.49"],
    [10, "claude-fable-5", 43.1, "xhigh", 36.6, 49.5, "$9.17"],
    [11, "claude-opus-5", 42.1, "max", 38.6, 45.5, "$5.94"],
    [12, "claude-opus-5", 41.5, "high", 35.7, 47.4, "$3.68"],
    [13, "gpt-5-6-sol", 41.0, "xhigh", 36.8, 45.2, "$2.02"],
    [14, "claude-fable-5", 40.5, "high", 38.6, 42.4, "$6.80"],
    [15, "gpt-5-6-terra", 39.0, "max", 36.5, 41.4, "$1.13"],
    [16, "gpt-5-6-terra", 37.4, "high", 34.9, 40.0, "$0.40"],
    [17, "gpt-5-6-sol", 36.9, "high", 34.9, 38.9, "$1.58"],
    [18, "gpt-5-6-terra", 36.9, "xhigh", 33.5, 40.3, "$0.60"],
    [20, "claude-opus-5", 36.4, "xhigh", 32.1, 40.7, "$4.93"],
    [22, "claude-fable-5", 35.4, "low", 31.1, 39.7, "$3.05"],
    [24, "gpt-5-6-sol", 34.9, "medium", 29.0, 40.7, "$1.10"],
    [26, "claude-opus-5", 34.4, "medium", 30.3, 38.4, "$2.04"],
    [28, "claude-fable-5-1", 33.8, "medium", 32.8, 34.9, "$1.12"],
    [32, "gpt-5-6-luna", 33.8, "max", 30.5, 37.2, "$0.84"],
    [33, "gpt-5-6-sol", 33.8, "low", 30.2, 37.5, "$0.59"],
    [35, "claude-fable-5-1", 32.8, "low", 26.6, 39.1, "$0.84"],
    [37, "claude-opus-4-8", 32.3, "max", 29.3, 35.3, "$6.77"],
    [38, "claude-sonnet-5", 32.3, "xhigh", 28.9, 35.7, "$3.17"],
    [41, "gpt-5-6-luna", 32.3, "high", 28.2, 36.4, "$0.38"],
    [45, "claude-sonnet-5", 31.3, "max", 29.4, 33.2, "$4.74"],
    [46, "gpt-5-6-luna", 31.3, "xhigh", 25.9, 36.6, "$0.57"],
    [47, "claude-opus-4-8", 30.8, "xhigh", 28.0, 33.5, "$5.63"],
    [48, "claude-opus-5-5", 30.8, "low", 27.6, 33.9, "$0.24"],
    [51, "claude-sonnet-5", 30.3, "high", 27.8, 32.7, "$2.31"],
    [53, "gpt-5-6-terra", 29.7, "medium", 27.2, 32.3, "$0.25"],
    [56, "claude-opus-4-8", 28.2, "medium", 22.5, 33.9, "$3.41"],
    [57, "gpt-5-6-terra", 28.2, "low", 25.5, 31.0, "$0.21"],
    [58, "claude-opus-4-8", 27.7, "high", 22.6, 32.8, "$4.08"],
    [60, "claude-opus-5", 27.2, "low", 23.8, 30.6, "$1.19"],
    [71, "claude-sonnet-5", 22.6, "medium", 19.2, 25.9, "$1.44"],
    [73, "claude-opus-4-8", 22.1, "low", 20.0, 24.1, "$1.84"],
    [79, "gpt-5-6-luna", 20.0, "medium", 15.7, 24.3, "$0.15"],
    [82, "claude-sonnet-5", 16.9, "low", 13.9, 19.9, "$0.74"],
    [84, "gpt-5-6-luna", 10.8, "low", 7.1, 14.5, "$0.066"],
  ];
  return rows.map(([rank, modelSlug, score, effort, low, high, runCost]) => fw("reactbench", "2026-10-19", modelSlug, score, {
    rank,
    effort: effort || undefined,
    setting: effort || undefined,
    runCost,
    ci: { kind: "range", low, high },
  }));
}

export const results: Result[] = [
  ...board("lmarena-webdev", "2026-10-19", webdevRows as BoardJson[]),
  ...board("lmarena-image-to-webdev", "2026-10-09", imageToWebdevRows as BoardJson[]),
  ...board("terminal-bench-4", "2026-10-06", terminalRows as BoardJson[]),
  ...board("slop-index", "2026-10-11", slopIndexRows as BoardJson[]),
  ...board("eqbench-creative-writing", "2026-10-12", eqbenchCreativeWritingRows as BoardJson[]),
  ...board("sudo-l7", "2026-10-09", sudoRows as BoardJson[]),
  ...board("deepswe-v1-1", "2026-09-22", deepsweRows as BoardJson[]),
  ...board("frontiercode-1-1", "2026-10-13", frontiercodeRows as BoardJson[]),
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
  fw("convex-evals", "2026-10-08", "gpt-6-astra", 90.18, { rank: 1, runCost: "$6.11", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 89.58, { rank: 2, runCost: "$3.63", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gemini-4-argon", 88.57, { rank: 3, runCost: "$1.62", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 88.39, { rank: 4, runCost: "$1.19", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5", 85.71, { rank: 5, runCost: "$7.90", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 85.71, { rank: 6, runCost: "$1.44", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-sol", 84.82, { rank: 7, runCost: "$1.67", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5-1", 83.04, { rank: 8, runCost: "$8.63", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-6", 81.25, { rank: 9, runCost: "$2.97", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 80.36, { rank: 10, runCost: "$4.53", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-7", 80.36, { rank: 11, runCost: "$4.65", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-4-8", 79.46, { rank: 12, runCost: "$4.47", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-5", 79.46, { rank: 13, runCost: "$1.64", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-wonder", 76.64, { rank: 14, runCost: "$6.58", setting: "6 runs" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 74.85, { rank: 15, runCost: "$0.155", setting: "6 runs" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5", 74.11, { rank: 16, runCost: "$1.86", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gemini-3-1-pro", 72.32, { rank: 17, runCost: "$3.99", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-terra", 68.75, { rank: 18, runCost: "$1.95", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "hy4-preview", 68.75, { rank: 19, runCost: "$1.98", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 67.86, { rank: 20, runCost: "$0.144", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 67.26, { rank: 21, runCost: "$0.0844", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "kimi-k3", 65.18, { rank: 22, runCost: "$2.05", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gemini-3-8-flash", 62.5, { rank: 23, runCost: "$2.34", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-luna", 61.61, { rank: 25, runCost: "$0.197", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-spark-1-3", 59.82, { rank: 26, runCost: "$1.76", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-pro", 56.25, { rank: 27, runCost: "$0.406", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "minimax-m3", 49.11, { rank: 30, runCost: "$0.618", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3-flash", 47.32, { rank: 31, runCost: "$0.0478", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-flash", 45.98, { rank: 32, runCost: "$0.094", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 38.39, { rank: 33, runCost: "$0.401", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "glm-5-2", 35.71, { rank: 34, runCost: "$0.932", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gemini-4-argon", 99.11, { arm: "assisted", runCost: "$2.03", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 97.92, { arm: "assisted", runCost: "$6.33", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 97.77, { arm: "assisted", runCost: "$2.77", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-astra", 97.77, { arm: "assisted", runCost: "$11.49", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5", 97.32, { arm: "assisted", runCost: "$14.48", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5-1", 97.32, { arm: "assisted", runCost: "$15.54", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-sol", 97.32, { arm: "assisted", runCost: "$2.67", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 96.43, { arm: "assisted", runCost: "$2.33", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "grok-4-5", 94.64, { arm: "assisted", runCost: "$1.74", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-6", 94.64, { arm: "assisted", runCost: "$2.88", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-7", 94.64, { arm: "assisted", runCost: "$4.45", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 93.75, { arm: "assisted", runCost: "$7.37", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-wonder", 93.08, { arm: "assisted", runCost: "$4.99", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-4-8", 92.86, { arm: "assisted", runCost: "$7.55", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "hy4-preview", 90.18, { arm: "assisted", runCost: "$1.95", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 89.43, { arm: "assisted", runCost: "$0.219", setting: "6 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-terra", 88.39, { arm: "assisted", runCost: "$2.76", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-spark-1-3", 87.5, { arm: "assisted", runCost: "$1.67", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5", 86.61, { arm: "assisted", runCost: "$3.23", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-luna", 86.61, { arm: "assisted", runCost: "$0.286", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "kimi-k3", 85.71, { arm: "assisted", runCost: "$1.67", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 85.42, { arm: "assisted", runCost: "$0.138", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gemini-3-1-pro", 84.82, { arm: "assisted", runCost: "$4.43", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gemini-3-8-flash", 83.04, { arm: "assisted", runCost: "$2.81", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 82.59, { arm: "assisted", runCost: "$0.182", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "minimax-m3", 80.36, { arm: "assisted", runCost: "$0.677", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-pro", 78.27, { arm: "assisted", runCost: "$0.401", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "mimo-v2-6-flash", 68.15, { arm: "assisted", runCost: "$0.092", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "glm-5-2", 66.07, { arm: "assisted", runCost: "$0.915", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3-flash", 65.18, { arm: "assisted", runCost: "$0.095", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 59.82, { arm: "assisted", runCost: "$0.508", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "gemini-4-argon", 95.83, { arm: "web", runCost: "$2.80", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 95.24, { arm: "web", runCost: "$6.85", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 92.26, { arm: "web", runCost: "$1.81", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-astra", 91.07, { arm: "web", runCost: "$8.51", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5", 89.29, { arm: "web", runCost: "$9.63", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5-1", 89.29, { arm: "web", runCost: "$13.60", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-sol", 89.29, { arm: "web", runCost: "$2.62", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 87.72, { arm: "web", runCost: "$1.63", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-4-8", 85.71, { arm: "web", runCost: "$7.45", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-wonder", 84.6, { arm: "web", runCost: "$8.61", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 83.93, { arm: "web", runCost: "$6.61", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5", 80.36, { arm: "web", runCost: "$2.42", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-5", 80.36, { arm: "web", runCost: "N/A", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 79.46, { arm: "web", runCost: "$0.325", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-terra", 79.46, { arm: "web", runCost: "$2.42", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-spark-1-3", 73.21, { arm: "web", runCost: "$2.59", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "kimi-k3", 73.21, { arm: "web", runCost: "$2.14", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 72.77, { arm: "web", runCost: "$0.647", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 69.64, { arm: "web", runCost: "$0.289", setting: "3 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-luna", 61.61, { arm: "web", runCost: "$0.387", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "minimax-m3", 54.46, { arm: "web", runCost: "$0.943", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3-flash", 54.46, { arm: "web", runCost: "$0.141", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-2", 52.68, { arm: "web", runCost: "$1.69", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 37.95, { arm: "web", runCost: "$0.448", setting: "2 runs" }),
  ...reactBench(),
];
