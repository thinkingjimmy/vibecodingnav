/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /scenarios/refactor/ 的跳转页
 * [POS]: 已移除场景的静态地址，output export 不能用 next.config redirects
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/benchmarks/android-bench-2-long/"
      title="This scenario moved"
      body="Large refactors now use the Android Bench 2.0 long-horizon board. The full source table is on the benchmark page."
      label="Android Bench 2.0 long-horizon"
    />
  );
}
