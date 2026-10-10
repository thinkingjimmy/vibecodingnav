/**
 * [INPUT]: 依赖 BuildView
 * [OUTPUT]: 对外提供 en 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { buildParams, buildMetadata, BuildView } from "@/views/build-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return buildParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return buildMetadata("en", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BuildView locale="en" params={params} />;
}
