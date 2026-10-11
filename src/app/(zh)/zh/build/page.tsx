/**
 * [INPUT]: 依赖 BuildIndex
 * [OUTPUT]: 对外提供 zh 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { BuildIndex, buildsMetadata } from "@/views/build-view";

export const metadata = buildsMetadata("zh");

export default function Page() {
  return <BuildIndex locale="zh" />;
}
