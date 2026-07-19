/**
 * [INPUT]: 依赖 Locale 与模型注册表的 ModelSlug
 * [OUTPUT]: 对外提供站点 URL、共享品牌图标、语言元数据与默认语言无前缀的模型路径生成器
 * [POS]: src/lib 的站点级常量模块，集中消除模型路由、语言路由与 SEO 硬编码
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Locale } from "./contracts";
import type { ModelSlug } from "./model";

export const SITE_URL = "https://aievalindex.vercel.app";

export const SITE_ICON = {
  url: "/aievalindex-mark.png",
  type: "image/png",
  sizes: "192x192",
} as const;

export const LOCALE_METADATA: Record<Locale, { flag: string; name: string }> = {
  en: { flag: "🇺🇸", name: "English" },
  "zh-CN": { flag: "🇨🇳", name: "中文" },
  ja: { flag: "🇯🇵", name: "日本語" },
  ko: { flag: "🇰🇷", name: "한국어" },
  es: { flag: "🇪🇸", name: "Español" },
  fr: { flag: "🇫🇷", name: "Français" },
};

export const modelPath = (locale: Locale, slug: ModelSlug) =>
  locale === "en" ? `/models/${slug}/` : `/${locale}/models/${slug}/`;
