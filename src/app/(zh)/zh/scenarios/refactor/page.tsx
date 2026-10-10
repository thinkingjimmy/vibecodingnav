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
      href="/zh/scenarios/android-app/#long"
      title="这个场景已并入 Android"
      body="大型重构与迁移不再单独成榜。Android Bench 2.0 长程在「做一个 Android App」的页签里，行和列与来源页一致。"
      label="做一个 Android App"
    />
  );
}
