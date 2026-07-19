/* 语言与模型路由单测：元数据、默认语言路径与模型注册表 */
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/contracts";
import { getModelEvaluation, isModelSlug, MODEL_SLUGS } from "@/lib/model";
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
    expect(MODEL_SLUGS).toEqual(["kimi-k3"]);
    expect(isModelSlug("kimi-k3")).toBe(true);
    expect(isModelSlug("missing-model")).toBe(false);
    expect(getModelEvaluation("kimi-k3")?.model.name).toBe("Kimi K3");
    expect(getModelEvaluation("missing-model")).toBeUndefined();
  });
});
