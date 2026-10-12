/**
 * [INPUT]: 依赖 Locale 与页面标题文案
 * [OUTPUT]: 对外提供 vibecodingnav.com 站点常量、GA4 测量 ID、90 天过期判断与 hreflang metadata
 * [POS]: src/lib 的站点级常量，页面不得散落域名、GA ID 或过期阈值
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Metadata } from "next";
import type { Locale } from "./contracts";
import { localePath } from "./locale";

export const SITE_URL = "https://vibecodingnav.com";
export const SITE_NAME = "vibecodingnav";
export const GA_MEASUREMENT_ID = "G-ZBKDEBT9C6";
export const CONTENT_CLOCK = "2026-10-10";
export const SITE_SYNC = "2026-10-10";
export const STALE_DAYS = 90;
export const SUGGEST_URL = "https://github.com/thinkingjimmy/AIEvalIndex/issues";

export function siteClock(now = new Date()): string {
  const iso = now.toISOString().slice(0, 10);
  return iso > CONTENT_CLOCK ? iso : CONTENT_CLOCK;
}

export function daysBetween(asOf: string, clock: string): number {
  const start = Date.parse(`${asOf}T00:00:00Z`);
  const end = Date.parse(`${clock}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

export function isStale(asOf: string, clock = siteClock()): boolean {
  return daysBetween(asOf, clock) > STALE_DAYS;
}

export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const canonical = `${SITE_URL}${localePath(locale, path)}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${localePath("en", path)}`,
        zh: `${SITE_URL}${localePath("zh", path)}`,
        "x-default": `${SITE_URL}${localePath("en", path)}`,
      },
    },
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, locale: locale === "zh" ? "zh_CN" : "en_US" },
  };
}
