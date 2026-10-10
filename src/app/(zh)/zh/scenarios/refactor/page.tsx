/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/scenarios/refactor/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/benchmarks/android-bench-2-long/"
      title="这个场景已并入 Android 长程榜"
      body="大型重构与迁移不再单独成场景。Android Bench 2.0 长程的完整原榜在基准页。"
      label="Android Bench 2.0 长程"
    />
  );
}
