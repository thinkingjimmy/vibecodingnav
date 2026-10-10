/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /scenarios/ios-app/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/scenarios/"
      title="There is no iOS scenario"
      body="No public iOS benchmark is listed here, so the editor's list is gone."
      label="Scenarios"
    />
  );
}
