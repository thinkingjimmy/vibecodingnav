/**
 * [INPUT]: 依赖 src/lib/contracts 的受支持语言集合
 * [OUTPUT]: 对外提供 isLocale、matchLocale、resolveLocale 纯函数
 * [POS]: src/lib 的语言决策模块，被静态路由、根路径跳转与单元测试共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { LOCALES, type Locale } from "./contracts";

export const isLocale = (value: string): value is Locale =>
  LOCALES.some((locale) => locale === value);

/* 基础语言码前缀匹配：zh-TW → zh-CN、es-MX → es，无需任何硬编码分支 */
export const matchLocale = (language: string): Locale | undefined => {
  if (isLocale(language)) return language;

  const base = language.toLowerCase().split("-")[0];
  return LOCALES.find((locale) => locale.split("-")[0] === base);
};

export const resolveLocale = (saved: string | null, languages: readonly string[]): Locale => {
  if (saved && isLocale(saved)) return saved;
  return languages.map(matchLocale).find(Boolean) ?? "en";
};
