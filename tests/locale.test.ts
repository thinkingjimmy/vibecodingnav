/* 语言与模型路由单测：元数据、默认语言路径与模型注册表 */
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/contracts";
import {
  getModelEvaluation,
  isModelSlug,
  MODEL_ROUTE_SLUGS,
  MODEL_SLUGS,
  resolveModelSlug,
} from "@/lib/model";
import { LOCALE_METADATA, modelPath } from "@/lib/site";

describe("locale resolution", () => {
  it("为所有受支持语言提供原生名与国旗", () => {
    expect(Object.keys(LOCALE_METADATA)).toEqual([...LOCALES]);
    expect(Object.values(LOCALE_METADATA).every(({ flag, name }) => flag && name)).toBe(true);
  });

  it("默认英文不加前缀，其他语言保留 locale 段", () => {
    expect(modelPath("en", "kimi-k3")).toBe("/models/kimi-k3/");
    expect(modelPath("zh-CN", "kimi-k3")).toBe("/zh-CN/models/kimi-k3/");
    expect(modelPath("fr", "kimi-k3")).toBe("/fr/models/kimi-k3/");
  });

  it("模型注册表只暴露有效 slug", () => {
    expect(MODEL_SLUGS).toEqual(["gpt-5-6-sol", "kimi-k3"]);
    expect(MODEL_ROUTE_SLUGS).toEqual(["gpt-5-6-sol", "kimi-k3", "gpt-5-5-max"]);
    expect(isModelSlug("gpt-5-6-sol")).toBe(true);
    expect(isModelSlug("gpt-5-5-max")).toBe(false);
    expect(resolveModelSlug("gpt-5-5-max")).toBe("gpt-5-6-sol");
    expect(isModelSlug("kimi-k3")).toBe(true);
    expect(isModelSlug("missing-model")).toBe(false);
    expect(getModelEvaluation("kimi-k3")?.model.name).toBe("Kimi K3");
    expect(getModelEvaluation("gpt-5-5-max")?.model.name).toBe("GPT-5.6 Sol (max)");
    expect(getModelEvaluation("missing-model")).toBeUndefined();
  });
});
