/**
 * [INPUT]: 依赖 ScenarioIndex
 * [OUTPUT]: 对外提供 en 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ScenarioIndex, scenariosMetadata } from "@/views/scenario-view";

export const metadata = scenariosMetadata("en");

export default function Page() {
  return <ScenarioIndex locale="en" />;
}
