/**
 * [INPUT]: 依赖 ToolsIndex
 * [OUTPUT]: 对外提供 zh 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ToolsIndex, toolsMetadata } from "@/views/tools-view";

export const metadata = toolsMetadata("zh");

export default function Page() {
  return <ToolsIndex locale="zh" />;
}
