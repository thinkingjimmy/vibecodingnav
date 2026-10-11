/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/scenarios/open-frontend/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/benchmarks/lmarena-webdev/"
      title="开源权重在 WebDev 榜单里"
      body="「用开源模型做前端」不再单独成场景。完整的 LMArena WebDev 在基准页，用「开源权重」筛选，名次保持来源名次。"
      label="LMArena WebDev"
    />
  );
}
