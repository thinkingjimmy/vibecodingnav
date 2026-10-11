/**
 * [INPUT]: 依赖 ChangesView
 * [OUTPUT]: 对外提供 zh 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ChangesView, changesMetadata } from "@/views/rest-view";

export const metadata = changesMetadata("zh");

export default function Page() {
  return <ChangesView locale="zh" />;
}
