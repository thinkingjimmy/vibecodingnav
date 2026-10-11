/**
 * [INPUT]: 依赖 MovedView
 * [OUTPUT]: 对外提供 /zh/scenarios/ios-app/ 的跳转页
 * [POS]: 已移除场景的静态地址
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { MovedView } from "@/views/moved-view";

export default function Page() {
  return (
    <MovedView
      locale="zh"
      href="/zh/scenarios/"
      title="没有 iOS 场景"
      body="这里没有公开的 iOS 专项榜，编辑精选已去掉。"
      label="场景"
    />
  );
}