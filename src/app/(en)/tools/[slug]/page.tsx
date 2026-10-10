/**
 * [INPUT]: 依赖 CategoryView
 * [OUTPUT]: 对外提供 en 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { categoryParams, categoryMetadata, CategoryView } from "@/views/tools-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return categoryMetadata("en", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryView locale="en" params={params} />;
}
