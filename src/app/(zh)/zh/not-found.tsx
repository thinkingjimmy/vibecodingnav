/**
 * [INPUT]: 依赖 NotFoundView
 * [OUTPUT]: 对外提供 zh 404
 * [POS]: 未匹配路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { NotFoundView } from "@/views/rest-view";

export default function NotFound() {
  return <NotFoundView locale="zh" />;
}
