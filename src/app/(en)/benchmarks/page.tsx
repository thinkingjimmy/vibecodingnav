/**
 * [INPUT]: 依赖 BenchmarkIndex
 * [OUTPUT]: 对外提供 en 列表页
 * [POS]: 静态列表路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { BenchmarkIndex, benchmarksMetadata } from "@/views/rest-view";

export const metadata = benchmarksMetadata("en");

export default function Page() {
  return <BenchmarkIndex locale="en" />;
}
