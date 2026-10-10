/**
 * [INPUT]: 依赖 Locale 契约
 * [OUTPUT]: 对外提供语言判断、带尾斜杠的本地化路径，以及中英路径对调
 * [POS]: src/lib 的路由语言边界，英文在根路径，中文在 /zh/
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { LOCALES, type Locale } from "./contracts";

export const isLocale = (value: string): value is Locale => LOCALES.some((locale) => locale === value);

export const t = (locale: Locale, text: { zh: string; en: string }) => text[locale];

export function localePath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash = normalized === "/" ? "/" : normalized.endsWith("/") ? normalized : `${normalized}/`;
  if (locale === "en") return withSlash;
  return withSlash === "/" ? "/zh/" : `/zh${withSlash}`;
}

export function swapLocale(pathname: string, target: Locale): string {
  const stripped = pathname.replace(/\/$/, "") || "/";
  const withoutZh = stripped.replace(/^\/zh(?=\/|$)/, "") || "/";
  return localePath(target, withoutZh);
}
