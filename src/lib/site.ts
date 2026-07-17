/**
 * [INPUT]: 依赖 src/lib/contracts 的 Locale
 * [OUTPUT]: 对外提供站点 URL、共享品牌图标、语言名/国旗元数据与语言链接生成器
 * [POS]: src/lib 的站点级常量模块，集中消除路由与 SEO 硬编码
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Locale } from "./contracts";

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

export const localePath = (locale: Locale) => `/${locale}/`;
