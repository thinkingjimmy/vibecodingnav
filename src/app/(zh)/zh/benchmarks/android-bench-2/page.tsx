/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/benchmarks/android-bench-2/ 的跳转页
 * [POS]: Android Bench 2.0 旧地址，打开合并页并选中 2.0
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/benchmarks/android-bench/?v=2.0"
      title="Android Bench 2.0 已并入 Android Bench"
      body="2.0 长程是当前版本，完整原榜在基准页。"
      label="Android Bench"
    />
  );
}
