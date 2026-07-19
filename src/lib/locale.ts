/**
 * [INPUT]: 依赖 src/lib/contracts 的受支持语言集合
 * [OUTPUT]: 对外提供 isLocale 语言合法性判定
 * [POS]: src/lib 的语言边界模块，被本地化动态路由与语言菜单共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { LOCALES, type Locale } from "./contracts";

export const isLocale = (value: string): value is Locale =>
  LOCALES.some((locale) => locale === value);
