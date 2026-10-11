/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /benchmarks/android-bench-2-long/ 的跳转页
 * [POS]: Android Bench 长程旧地址，用 #long 选中当前版本
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/benchmarks/android-bench/#long"
      title="The long-horizon board now lives on Android Bench"
      body="2.0 long-horizon is the current version. The full board is on the benchmark page."
      label="Android Bench"
    />
  );
}
