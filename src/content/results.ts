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
import frontiercode1Rows from "./boards/frontiercode-1.json";
import sudoRows from "./boards/sudo.json";
import terminalRows from "./boards/terminal.json";
import convexNoRows from "./boards/convex-no.json";
import convexWithRows from "./boards/convex-with.json";
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
  provisional?: "autoeval";
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
    provisional: row.provisional,
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

interface ConvexSource {
  model: string;
  totalScore: number;
  runCount: number;
  averageRunCostUsd: number;
  sourceIndex: number;
}

/** 只映射已有模型页的行。名次按来源全表计算，未映射的行留出空号。日期档用 effort 分开，不并成一行。 */
const CONVEX_MODEL: Record<string, { slug: string; effort?: string }> = {
  "anthropic/claude-fable-5.2": { slug: "claude-fable-5-2" },
  "anthropic/claude-fable-5.1": { slug: "claude-fable-5-1" },
  "anthropic/claude-fable-5": { slug: "claude-fable-5" },
  "anthropic/claude-opus-5.5": { slug: "claude-opus-5-5" },
  "anthropic/claude-opus-5": { slug: "claude-opus-5" },
  "anthropic/claude-opus-4.8": { slug: "claude-opus-4-8" },
  "anthropic/claude-sonnet-5.5": { slug: "claude-sonnet-5-5" },
  "anthropic/claude-sonnet-5": { slug: "claude-sonnet-5" },
  "anthropic/claude-haiku-5.5": { slug: "claude-haiku-5-5" },
  "openai/gpt-6-astra": { slug: "gpt-6-astra" },
  "openai/gpt-6.1-sol": { slug: "gpt-6-1-sol" },
  "openai/gpt-6-luna": { slug: "gpt-6-luna" },
  "openai/gpt-5.6-sol": { slug: "gpt-5-6-sol" },
  "openai/gpt-5.6-terra": { slug: "gpt-5-6-terra" },
  "openai/gpt-5.6-luna": { slug: "gpt-5-6-luna" },
  "openai/gpt-5.5": { slug: "gpt-5-5" },
  "google/gemini-4-argon": { slug: "gemini-4-argon" },
  "google/gemini-3.8-flash": { slug: "gemini-3-8-flash" },
  "google/gemini-3.1-pro-preview": { slug: "gemini-3-1-pro" },
  "x-ai/grok-4.7": { slug: "grok-4-7" },
  "x-ai/grok-4.6": { slug: "grok-4-6" },
  "x-ai/grok-4.5": { slug: "grok-4-5" },
  "meta/muse-wonder": { slug: "muse-wonder" },
  "meta/muse-spark-1.3": { slug: "muse-spark-1-3" },
  "moonshotai/kimi-k3.1-pro": { slug: "kimi-k3-1-pro" },
  "moonshotai/kimi-k3": { slug: "kimi-k3" },
  "tencent/hy4-preview": { slug: "hy4-preview" },
  "xiaomi/mimo-v2.6-pro": { slug: "mimo-v2-6-pro" },
  "xiaomi/mimo-v2.6-flash": { slug: "mimo-v2-6-flash" },
  "minimax/minimax-m3": { slug: "minimax-m3" },
  "z-ai/glm-5.3": { slug: "glm-5-3" },
  "z-ai/glm-5.3-flash": { slug: "glm-5-3-flash" },
  "z-ai/glm-5.2": { slug: "glm-5-2" },
  "deepseek/deepseek-v4.1-flash": { slug: "deepseek-v4-1-flash" },
  "deepseek/deepseek-v4.1-flash-1017": { slug: "deepseek-v4-1-flash", effort: "1017" },
  "deepseek/deepseek-v4-flash": { slug: "deepseek-v4-flash", effort: "0423" },
  "deepseek/deepseek-v4-flash-0731": { slug: "deepseek-v4-flash", effort: "0731" },
  "deepseek/deepseek-v4-pro": { slug: "deepseek-v4-pro", effort: "0423" },
};

function convexMoney(value: number) {
  if (value >= 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(5).replace(/0+$/, "").replace(/\.$/, "")}`;
}

function convexArm(rows: ConvexSource[], arm: "baseline" | "assisted"): Result[] {
  const sorted = [...rows].sort((a, b) => b.totalScore - a.totalScore || a.sourceIndex - b.sourceIndex);
  let last = Number.NaN;
  let rank = 0;
  const out: Result[] = [];
  sorted.forEach((row, index) => {
    if (row.totalScore !== last) {
      rank = index + 1;
      last = row.totalScore;
    }
    const mapped = CONVEX_MODEL[row.model];
    if (!mapped) return;
    const runs = `${Math.round(row.runCount)} runs`;
    out.push(fw("convex-evals", "2026-11-10", mapped.slug, Math.round(row.totalScore * 10000) / 100, {
      arm,
      rank,
      effort: mapped.effort,
      setting: mapped.effort ? `${mapped.effort} · ${runs}` : runs,
      runCost: convexMoney(row.averageRunCostUsd),
    }));
  });
  return out;
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
  ...board("lmarena-webdev", "2026-11-10", webdevRows as BoardJson[]),
  ...board("lmarena-image-to-webdev", "2026-11-10", imageToWebdevRows as BoardJson[]),
  ...board("terminal-bench-4", "2026-10-06", terminalRows as BoardJson[]),
  ...board("slop-index", "2026-10-28", slopIndexRows as BoardJson[]),
  ...board("eqbench-creative-writing", "2026-10-29", eqbenchCreativeWritingRows as BoardJson[]),
  ...board("sudo-l7", "2026-10-28", sudoRows as BoardJson[]),
  ...board("deepswe-v1-1", "2026-09-22", deepsweRows as BoardJson[]),
  ...board("frontiercode", "2026-10-27", frontiercodeRows as BoardJson[], "2.0"),
  ...board("frontiercode", "2026-10-13", frontiercode1Rows as BoardJson[], "1.1"),
  ...board("android-bench", "2026-11-04", androidLong as BoardJson[], "2.0"),
  ...board("android-bench", "2026-10-06", android1 as BoardJson[], "1.0"),
  fw("supabase-evals", "2026-10-30", "claude-opus-5-5", 90, { rank: 1, effort: "medium", setting: "medium · Claude Code" }),
  fw("supabase-evals", "2026-10-30", "kimi-k3", 88, { rank: 2, setting: "OpenCode" }),
  fw("supabase-evals", "2026-10-30", "grok-4-7", 84, { rank: 3, effort: "high", setting: "high · Grok" }),
  fw("supabase-evals", "2026-10-30", "gpt-6-1-sol", 78, { rank: 4, effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-30", "claude-sonnet-5-5", 77, { rank: 5, effort: "medium", setting: "medium · Claude Code" }),
  fw("supabase-evals", "2026-10-30", "gpt-6-luna", 70, { rank: 6, effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-30", "claude-opus-5-5", 93, { arm: "assisted", effort: "medium", setting: "medium · Claude Code" }),
  fw("supabase-evals", "2026-10-30", "kimi-k3", 86, { arm: "assisted", setting: "OpenCode" }),
  fw("supabase-evals", "2026-10-30", "grok-4-7", 83, { arm: "assisted", effort: "high", setting: "high · Grok" }),
  fw("supabase-evals", "2026-10-30", "gpt-6-1-sol", 81, { arm: "assisted", effort: "medium", setting: "medium · Codex" }),
  fw("supabase-evals", "2026-10-30", "claude-sonnet-5-5", 86, { arm: "assisted", effort: "medium", setting: "medium · Claude Code" }),
  fw("supabase-evals", "2026-10-30", "gpt-6-luna", 77, { arm: "assisted", effort: "medium", setting: "medium · Codex" }),
  fw("nextjs-evals", "2026-10-30", "claude-opus-5-5", 97, { rank: 1, effort: "high", setting: "high · Claude Code", runCost: "$0.234" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-sol", 97, { rank: 2, effort: "high", setting: "high · Codex", runCost: "$0.257" }),
  fw("nextjs-evals", "2026-10-30", "gemini-4-argon", 97, { rank: 3, setting: "OpenCode", runCost: "$0.435" }),
  fw("nextjs-evals", "2026-10-30", "claude-fable-5-1", 97, { rank: 4, effort: "high", setting: "high · Claude Code", runCost: "$0.722" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-1-terra", 97, { rank: 5, effort: "high", setting: "high · Codex", runCost: "$0.083" }),
  fw("nextjs-evals", "2026-10-30", "grok-4-7", 94, { rank: 6, setting: "OpenCode", runCost: "$0.182" }),
  fw("nextjs-evals", "2026-10-30", "gemini-3-8-flash", 90, { rank: 7, setting: "OpenCode", runCost: "$0.605" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-astra", 90, { rank: 8, effort: "high", setting: "high · Codex", runCost: "$0.969" }),
  fw("nextjs-evals", "2026-10-30", "kimi-k3", 84, { rank: 10, setting: "OpenCode", runCost: "$0.281" }),
  fw("nextjs-evals", "2026-10-30", "glm-5-2", 81, { rank: 11, setting: "OpenCode", runCost: "$0.152" }),
  fw("nextjs-evals", "2026-10-30", "claude-sonnet-5", 81, { rank: 12, setting: "Claude Code", runCost: "$0.386" }),
  fw("nextjs-evals", "2026-10-30", "cursor-composer-2-5", 81, { rank: 13, setting: "Cursor", runCost: "$0.062" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-luna", 81, { rank: 14, effort: "high", setting: "high · Codex", runCost: "$0.012" }),
  fw("nextjs-evals", "2026-10-30", "minimax-m3", 81, { rank: 15, setting: "OpenCode", runCost: "$0.053" }),
  fw("nextjs-evals", "2026-10-30", "kimi-k2-7-code", 74, { rank: 16, setting: "OpenCode", runCost: "$0.139" }),
  fw("nextjs-evals", "2026-10-30", "claude-opus-5-5", 97, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-sol", 97, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-10-30", "gemini-4-argon", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "claude-fable-5-1", 97, { arm: "assisted", effort: "high", setting: "high · Claude Code" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-1-terra", 94, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-10-30", "grok-4-7", 94, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "gemini-3-8-flash", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-astra", 97, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-10-30", "kimi-k3", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "glm-5-2", 97, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "claude-sonnet-5", 97, { arm: "assisted", setting: "Claude Code" }),
  fw("nextjs-evals", "2026-10-30", "cursor-composer-2-5", 94, { arm: "assisted", setting: "Cursor" }),
  fw("nextjs-evals", "2026-10-30", "gpt-6-luna", 90, { arm: "assisted", effort: "high", setting: "high · Codex" }),
  fw("nextjs-evals", "2026-10-30", "minimax-m3", 90, { arm: "assisted", setting: "OpenCode" }),
  fw("nextjs-evals", "2026-10-30", "kimi-k2-7-code", 90, { arm: "assisted", setting: "OpenCode" }),
  ...convexArm(convexNoRows as ConvexSource[], "baseline"),
  ...convexArm(convexWithRows as ConvexSource[], "assisted"),
  fw("convex-evals", "2026-10-08", "gemini-4-argon", 95.76, { arm: "web", runCost: "$2.77", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5-5", 95.09, { arm: "web", runCost: "$6.83", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-1-sol", 92.19, { arm: "web", runCost: "$1.80", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-astra", 91.07, { arm: "web", runCost: "$8.51", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5", 89.29, { arm: "web", runCost: "$9.63", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-fable-5-1", 89.29, { arm: "web", runCost: "$13.60", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-sol", 89.29, { arm: "web", runCost: "$2.62", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5-5", 88.39, { arm: "web", runCost: "$1.62", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-5", 85.71, { arm: "web", runCost: "$6.67", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "claude-opus-4-8", 85.71, { arm: "web", runCost: "$7.45", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "muse-wonder", 84.46, { arm: "web", runCost: "$8.67", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "claude-sonnet-5", 80.36, { arm: "web", runCost: "$2.42", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "grok-4-5", 80.36, { arm: "web", runCost: "N/A", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-terra", 79.46, { arm: "web", runCost: "$2.42", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "claude-haiku-5-5", 78.44, { arm: "web", runCost: "$0.3318", setting: "7 runs" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-1-flash", 75, { arm: "web", runCost: "$0.38832", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "kimi-k3", 74.55, { arm: "web", runCost: "$2.14", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "muse-spark-1-3", 74.29, { arm: "web", runCost: "$2.58", setting: "5 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-6-luna", 69.2, { arm: "web", runCost: "$0.28928", setting: "4 runs" }),
  fw("convex-evals", "2026-10-08", "gpt-5-6-luna", 61.61, { arm: "web", runCost: "$0.3875", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "minimax-m3", 54.46, { arm: "web", runCost: "$0.94328", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3-flash", 54.02, { arm: "web", runCost: "$0.13019", setting: "2 runs" }),
  fw("convex-evals", "2026-10-08", "glm-5-2", 52.68, { arm: "web", runCost: "$1.69", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-flash", 51.79, { arm: "web", runCost: "$0.42619", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "deepseek-v4-pro", 50.89, { arm: "web", runCost: "$1.00", setting: "1 run" }),
  fw("convex-evals", "2026-10-08", "glm-5-3", 37.95, { arm: "web", runCost: "$0.44806", setting: "2 runs" }),
...reactBench(),
];
