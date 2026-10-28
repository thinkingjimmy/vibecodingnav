/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /benchmarks/frontiercode-1-1/ 的跳转页
 * [POS]: FrontierCode 1.1 旧地址，打开合并页并选中 1.1
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/benchmarks/frontiercode/?v=1.1"
      title="FrontierCode 1.1 is now part of FrontierCode"
      body="1.1 is an archived version. The full board stays on the benchmark page; scenarios use 2.0."
      label="FrontierCode 1.1"
    />
  );
}
