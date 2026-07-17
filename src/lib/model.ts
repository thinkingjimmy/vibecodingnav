/**
 * [INPUT]: 依赖类型化 Kimi K3 内容与 Locale/LocalizedText 契约
 * [OUTPUT]: 对外提供 evaluation 数据与 localize 英文兜底函数
 * [POS]: src/lib 的模型内容访问层，隔离页面组件与具体内容文件位置
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import evaluation from "@/content/models/kimi-k3";
import type { Locale, LocalizedText } from "./contracts";

export { evaluation };

export const localize = (field: LocalizedText, locale: Locale) => field[locale] ?? field.en;
