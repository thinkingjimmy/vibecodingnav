/**
 * [INPUT]: 依赖类型化 Kimi K3 内容与 Locale/LocalizedText/ModelEvaluation 契约
 * [OUTPUT]: 对外提供模型 slug 注册表、模型查询/判定能力与 localize 英文兜底函数
 * [POS]: src/lib 的模型内容访问层，隔离动态路由、页面组件与具体内容文件位置
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import kimiK3 from "@/content/models/kimi-k3";
import type { Locale, LocalizedText, ModelEvaluation } from "./contracts";

const MODEL_REGISTRY = {
  "kimi-k3": kimiK3,
} satisfies Record<string, ModelEvaluation>;

export type ModelSlug = keyof typeof MODEL_REGISTRY;

export const MODEL_SLUGS = Object.keys(MODEL_REGISTRY) as ModelSlug[];

export const isModelSlug = (value: string): value is ModelSlug =>
  Object.hasOwn(MODEL_REGISTRY, value);

export const getModelEvaluation = (slug: string): ModelEvaluation | undefined =>
  isModelSlug(slug) ? MODEL_REGISTRY[slug] : undefined;

export const localize = (field: LocalizedText, locale: Locale) => field[locale] ?? field.en;
