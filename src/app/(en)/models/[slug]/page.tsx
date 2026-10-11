/**
 * [INPUT]: 依赖 ModelView
 * [OUTPUT]: 对外提供 en 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { modelParams, modelMetadata, ModelView } from "@/views/model-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return modelParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return modelMetadata("en", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ModelView locale="en" params={params} />;
}
