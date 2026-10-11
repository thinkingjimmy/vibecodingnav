/**
 * [INPUT]: 依赖 ScenarioView
 * [OUTPUT]: 对外提供 zh 详情页
 * [POS]: 静态详情路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { scenarioParams, scenarioMetadata, ScenarioView } from "@/views/scenario-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return scenarioParams();
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return scenarioMetadata("zh", params);
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ScenarioView locale="zh" params={params} />;
}
