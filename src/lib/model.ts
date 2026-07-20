/**
 * [INPUT]: 依赖类型化 Kimi K3、GPT-5.6 Sol (max) 内容与 Locale/LocalizedText/ModelEvaluation 契约
 * [OUTPUT]: 对外提供 canonical 模型 slug 注册表、含 GPT-5.5 误命名兼容项的静态路由 slug、slug 解析/查询与 localize 英文兜底函数
 * [POS]: src/lib 的模型内容访问层，隔离动态路由、页面组件与具体内容文件位置
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import kimiK3 from "@/content/models/kimi-k3";
import gpt56Sol from "@/content/models/gpt-5-6-sol";
import type { Locale, LocalizedText, ModelEvaluation } from "./contracts";

const MODEL_REGISTRY = {
  "gpt-5-6-sol": gpt56Sol,
  "kimi-k3": kimiK3,
} satisfies Record<string, ModelEvaluation>;

export type ModelSlug = keyof typeof MODEL_REGISTRY;

export const MODEL_SLUGS = Object.keys(MODEL_REGISTRY) as ModelSlug[];

const LEGACY_MODEL_SLUGS = {
  "gpt-5-5-max": "gpt-5-6-sol",
} as const satisfies Record<string, ModelSlug>;

export const MODEL_ROUTE_SLUGS = [
  ...MODEL_SLUGS,
  ...Object.keys(LEGACY_MODEL_SLUGS),
];

export const isModelSlug = (value: string): value is ModelSlug =>
  Object.hasOwn(MODEL_REGISTRY, value);

export const resolveModelSlug = (value: string): ModelSlug | undefined =>
  isModelSlug(value)
    ? value
    : LEGACY_MODEL_SLUGS[value as keyof typeof LEGACY_MODEL_SLUGS];

export const getModelEvaluation = (slug: string): ModelEvaluation | undefined => {
  const modelSlug = resolveModelSlug(slug);
  return modelSlug ? MODEL_REGISTRY[modelSlug] : undefined;
};

export const localize = (field: LocalizedText, locale: Locale) => field[locale] ?? field.en;
