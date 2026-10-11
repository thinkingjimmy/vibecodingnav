/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/scenarios/production-changes/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/scenarios/web-frontend/"
      title="这个场景已并入「做 Web 前端」"
      body="sudo L7 是通用编码能力榜，现归入「做 Web 前端」。融合表和综合分在该场景里计入它。"
      label="做 Web 前端"
    />
  );
}
