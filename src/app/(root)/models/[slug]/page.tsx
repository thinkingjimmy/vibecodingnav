/**
 * [INPUT]: 依赖模型 slug 注册表与 src/app/model-detail 的共享详情页/metadata
 * [OUTPUT]: 对外静态生成默认英文 `/models/{slug}/` 模型详情路由
 * [POS]: src/app/(root)/models/[slug] 的默认语言动态页面，不承载重复业务逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { notFound } from "next/navigation";
import { createModelMetadata, ModelDetail } from "@/app/model-detail";
import { isModelSlug, MODEL_SLUGS } from "@/lib/model";

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return MODEL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ModelPageProps) {
  const { slug } = await params;
  if (!isModelSlug(slug)) notFound();
  return createModelMetadata("en", slug);
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  if (!isModelSlug(slug)) notFound();
  return <ModelDetail locale="en" slug={slug} />;
}
