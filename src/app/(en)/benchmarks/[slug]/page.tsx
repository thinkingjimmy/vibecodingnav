/**
 * [INPUT]: 依赖 BenchmarkView
 * [OUTPUT]: 对外提供 en 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { benchmarkParams, benchmarkMetadata, BenchmarkView } from "@/views/rest-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return benchmarkParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return benchmarkMetadata("en", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <BenchmarkView locale="en" params={params} />;
}
