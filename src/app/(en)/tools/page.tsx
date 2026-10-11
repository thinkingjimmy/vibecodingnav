/**
 * [INPUT]: 依赖 ToolsIndex
 * [OUTPUT]: 对外提供 en 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ToolsIndex, toolsMetadata } from "@/views/tools-view";

export const metadata = toolsMetadata("en");

export default function Page() {
  return <ToolsIndex locale="en" />;
}
