/**
 * [INPUT]: 依赖 locale/模型 slug 判定、模型注册表与 src/app/model-detail 共享详情页/metadata
 * [OUTPUT]: 对外静态生成五种非默认语言的 `/{locale}/models/{slug}/` 模型详情路由
 * [POS]: src/app/[locale]/models/[slug] 的本地化动态页面，不承载重复业务逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { notFound } from "next/navigation";
import { createModelMetadata, ModelDetail } from "@/app/model-detail";
import { isLocale } from "@/lib/locale";
import { isModelSlug, MODEL_SLUGS } from "@/lib/model";

interface LocalizedModelPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return MODEL_SLUGS.map((slug) => ({ slug }));
}

async function resolveParams(params: LocalizedModelPageProps["params"]) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en" || !isModelSlug(slug)) notFound();
  return { locale, slug };
}

export async function generateMetadata({ params }: LocalizedModelPageProps) {
  const { locale, slug } = await resolveParams(params);
  return createModelMetadata(locale, slug);
}

export default async function LocalizedModelPage({ params }: LocalizedModelPageProps) {
  const { locale, slug } = await resolveParams(params);
  return <ModelDetail locale={locale} slug={slug} />;
}
