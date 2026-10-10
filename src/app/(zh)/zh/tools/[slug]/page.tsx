/**
 * [INPUT]: 依赖 CategoryView
 * [OUTPUT]: 对外提供 zh 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { categoryParams, categoryMetadata, CategoryView } from "@/views/tools-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return categoryMetadata("zh", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CategoryView locale="zh" params={params} />;
}
