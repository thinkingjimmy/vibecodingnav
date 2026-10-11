/**
 * [INPUT]: 依赖 ItemView
 * [OUTPUT]: 对外提供 zh 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { itemParams, itemMetadata, ItemView } from "@/views/tools-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return itemParams("prompt");
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return itemMetadata("zh", "prompt", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ItemView locale="zh" type="prompt" params={params} />;
}
