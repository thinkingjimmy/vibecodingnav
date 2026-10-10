/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /scenarios/open-frontend/ 的跳转页
 * [POS]: 已移除场景的静态地址，output export 不能用 next.config redirects
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/scenarios/web-frontend/"
      title="This scenario moved"
      body="Open weights are a filter on the LMArena WebDev board. The filter keeps the source ranks."
      label="Build a Web frontend"
    />
  );
}
