import { describe, expect, it } from "vitest";

import { MODEL_CATALOG } from "@/content/models/catalog";
import { INTELLIGENCE_INDEX } from "@/content/models/intelligence-index";
import { getModelEvaluation } from "@/lib/model";

describe("model score data", () => {
  it("详情页与 Header 目录共享同一个 Intelligence Index", () => {
    for (const [slug, score] of Object.entries(INTELLIGENCE_INDEX)) {
      const evaluation = getModelEvaluation(slug)!;
      const heroScore = evaluation.heroStats.find((stat) => stat.labelKey === "intelligence")?.value;
      const benchmarkScore = evaluation.benchmarks.find((benchmark) =>
        benchmark.name.includes("Intelligence Index"),
      )?.score;
      const catalogScore = MODEL_CATALOG
        .flatMap((group) => group.models)
        .find((model) => model.slug === slug)?.score;

      expect(heroScore).toBe(String(score));
      expect(benchmarkScore).toBe(String(score));
      expect(catalogScore).toBe(score);
    }
  });

  it("GPT-5.6 Sol 使用 OpenAI 核心官方跑分与固定比较锚点", () => {
    const evaluation = getModelEvaluation("gpt-5-6-sol")!;
    const scores = Object.fromEntries(
      evaluation.benchmarks.map((benchmark) => [benchmark.name, benchmark.score]),
    );

    expect(evaluation.anchors).toEqual([
      { name: "Claude Fable 5", label: "Fable 5" },
      { name: "GPT-5.5", label: "GPT-5.5" },
      { name: "Claude Opus 4.8", label: "Opus 4.8" },
    ]);
    expect(scores).toEqual({
      "Artificial Analysis Intelligence Index v4.1": "58.9",
      "Agents' Last Exam": "52.7",
      "Artificial Analysis Coding Agent Index v1.1": "80",
      "SWE-Bench Pro": "64.6",
      "DeepSWE v1.1": "72.7",
      "Terminal-Bench 2.1": "88.8",
      BrowseComp: "90.4",
      "MMMU Pro (with tools)": "84.6",
      "GPQA Diamond": "94.6",
      "FrontierMath Tier 4 (v2)": "83",
      AutomationBench: "18.1",
    });
    expect(evaluation.benchmarks.find((benchmark) => benchmark.name === "BrowseComp")?.peers).toEqual({
      "GPT-5.5": "84.4",
      "Claude Opus 4.8": "84.3",
    });
    expect(evaluation.sources[0]).toEqual({
      name: "OpenAI — GPT-5.6 launch evaluations",
      url: "https://openai.com/zh-Hans-CN/index/gpt-5-6/",
    });
  });
});
