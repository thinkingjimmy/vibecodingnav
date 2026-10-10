/**
 * [INPUT]: 依赖 ModelIndex
 * [OUTPUT]: 对外提供 zh 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ModelIndex, modelsMetadata } from "@/views/model-view";

export const metadata = modelsMetadata("zh");

export default function Page() {
  return <ModelIndex locale="zh" />;
}
