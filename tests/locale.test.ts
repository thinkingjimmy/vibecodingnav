/* 语言决策单测：元数据完整性、持久化优先级、地区归并与英文兜底 */
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/contracts";
import { matchLocale, resolveLocale } from "@/lib/locale";
import { LOCALE_METADATA } from "@/lib/site";

describe("locale resolution", () => {
  it("为所有受支持语言提供原生名与国旗", () => {
    expect(Object.keys(LOCALE_METADATA)).toEqual([...LOCALES]);
    expect(Object.values(LOCALE_METADATA).every(({ flag, name }) => flag && name)).toBe(true);
  });

  it("优先使用受支持的持久化语言", () => {
    expect(resolveLocale("fr", ["zh-TW"])).toBe("fr");
  });

  it("归并中文地区并匹配其他语言基础码", () => {
    expect(matchLocale("zh-TW")).toBe("zh-CN");
    expect(matchLocale("es-MX")).toBe("es");
  });

  it("跳过无效持久化值并最终回落英文", () => {
    expect(resolveLocale("de", ["ko-KR"])).toBe("ko");
    expect(resolveLocale(null, ["de-DE"])).toBe("en");
  });
});
