/**
 * [INPUT]: 依赖中英 UI 字典与 Locale
 * [OUTPUT]: 对外提供 getDictionary
 * [POS]: src/lib 的界面文案入口，页面不直接 import 语言文件
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary, Locale } from "./contracts";
import en from "@/content/i18n/en";
import zh from "@/content/i18n/zh";

const dictionaries: Record<Locale, Dictionary> = { en, zh };

export const getDictionary = (locale: Locale) => dictionaries[locale];
