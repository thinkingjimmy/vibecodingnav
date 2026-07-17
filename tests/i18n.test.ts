/* 国际化单测：UI 字典与内容字段的英文兜底，防止缺译导致页面空白 */
import { describe, expect, it } from "vitest";
import { mergeDictionary } from "@/lib/i18n";
import { localize } from "@/lib/model";

describe("i18n fallback", () => {
  it("只覆盖指定字段，其余字段回落英文母本", () => {
    const dictionary = mergeDictionary({ header: { language: "语言" } });
    expect(dictionary.header.language).toBe("语言");
    expect(dictionary.header.tagline).toBe("AI model scores and real-world reviews, together");
    expect(dictionary.footer.sources).toBe("Data sources");
  });

  it("内容缺少目标语言时回落英文", () => {
    expect(localize({ en: "English", ja: "日本語" }, "fr")).toBe("English");
    expect(localize({ en: "English", ja: "日本語" }, "ja")).toBe("日本語");
  });
});
