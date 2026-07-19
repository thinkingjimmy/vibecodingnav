/**
 * [INPUT]: 依赖六份类型化 UI 字典与 Dictionary/DeepPartial/Locale 契约
 * [OUTPUT]: 对外提供 mergeDictionary 与 getDictionary 英文兜底读取函数
 * [POS]: src/lib 的 UI 国际化访问层，页面不得直接依赖具体语言文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import en from "@/content/i18n/en";
import es from "@/content/i18n/es";
import fr from "@/content/i18n/fr";
import ja from "@/content/i18n/ja";
import ko from "@/content/i18n/ko";
import zhCN from "@/content/i18n/zh-CN";
import type { DeepPartial, Dictionary, Locale } from "./contracts";

const overrides: Record<Locale, DeepPartial<Dictionary>> = {
  en: {},
  "zh-CN": zhCN,
  ja,
  ko,
  es,
  fr,
};

/* 显式逐 section 合并：新增 Dictionary section 时漏改此处会直接编译报错，无需运行时防御 */
export const mergeDictionary = (override: DeepPartial<Dictionary>): Dictionary => ({
  meta: { ...en.meta, ...override.meta },
  header: { ...en.header, ...override.header },
  hero: { ...en.hero, ...override.hero },
  stats: { ...en.stats, ...override.stats },
  bench: { ...en.bench, ...override.bench },
  reviews: { ...en.reviews, ...override.reviews },
  feed: { ...en.feed, ...override.feed },
  footer: { ...en.footer, ...override.footer },
});

export const getDictionary = (locale: Locale) => mergeDictionary(overrides[locale]);
