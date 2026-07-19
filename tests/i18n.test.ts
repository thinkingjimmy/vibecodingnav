/* 国际化单测：UI 字典与内容字段的英文兜底，防止缺译导致页面空白 */
import { describe, expect, it } from "vitest";
import { mergeDictionary } from "@/lib/i18n";
import { localize } from "@/lib/model";

describe("i18n fallback", () => {
  it("只覆盖指定字段，其余字段回落英文母本", () => {
    const dictionary = mergeDictionary({ header: { language: "语言" } });
    expect(dictionary.header.language).toBe("语言");
    expect(dictionary.feed.headlineLead).toBe("Straight from the");
    expect(dictionary.feed.positiveLabel).toBe("strengths");
    expect(dictionary.feed.negativeLabel).toBe("caveats");
    expect(dictionary.footer.description).toBe("An independent, hand-curated index of frontier model evaluations — every number links back to its source.");
    expect(dictionary.footer.dataSources).toBe("Data sources");
  });

  it("内容缺少目标语言时回落英文", () => {
    expect(localize({ en: "English", ja: "日本語" }, "fr")).toBe("English");
    expect(localize({ en: "English", ja: "日本語" }, "ja")).toBe("日本語");
  });
});
