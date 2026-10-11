/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /scenarios/saas/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="en"
      href="/build/saas/"
      title="Full-stack SaaS is a set, not a scenario"
      body="That board was a second copy of Terminal-Bench. The set stays, and it cites the CLI scenario plus the framework evals."
      label="Build a full-stack SaaS"
    />
  );
}
