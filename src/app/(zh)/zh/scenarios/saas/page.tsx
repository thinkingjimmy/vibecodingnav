/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/scenarios/saas/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/build/saas/"
      title="全栈 SaaS 是一套组合，不是一张场景榜"
      body="那张榜是 Terminal-Bench 的第二份副本。组合页还在，依据是命令行场景和各框架评测。"
      label="做全栈 SaaS，用这一套"
    />
  );
}
