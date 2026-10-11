/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/benchmarks/android-bench-1/ 的跳转页
 * [POS]: Android Bench 1.0 旧地址，打开合并页并选中 1.0
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/benchmarks/android-bench/?v=1.0"
      title="Android Bench 1.0 已并入 Android Bench"
      body="1.0 是历史版本，完整原榜仍在基准页。"
      label="Android Bench 1.0"
    />
  );
}
