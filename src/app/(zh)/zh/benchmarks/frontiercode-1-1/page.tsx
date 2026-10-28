/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/benchmarks/frontiercode-1-1/ 的跳转页
 * [POS]: FrontierCode 1.1 旧地址，打开合并页并选中 1.1
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/benchmarks/frontiercode/?v=1.1"
      title="FrontierCode 1.1 已并入 FrontierCode"
      body="1.1 是历史版本，完整原榜仍在基准页；当前场景列使用 2.0。"
      label="FrontierCode 1.1"
    />
  );
}
