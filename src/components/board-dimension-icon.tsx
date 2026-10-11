/**
 * [INPUT]: 依赖 Phosphor Icons 与场景列头图标名
 * [OUTPUT]: 对外提供融合表列头的维度图标
 * [POS]: src/components 的场景列头图标映射
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Article, Atom, DeviceMobile, FileCode, Image, RoadHorizon, Scales, TerminalWindow, UsersThree } from "@phosphor-icons/react";
import type { ScenarioBoardIcon } from "@/lib/contracts";

const ICONS = {
  "users-three": UsersThree,
  image: Image,
  "file-code": FileCode,
  atom: Atom,
  scales: Scales,
  "road-horizon": RoadHorizon,
  "device-mobile": DeviceMobile,
  "terminal-window": TerminalWindow,
  article: Article,
} as const satisfies Record<ScenarioBoardIcon, typeof Scales>;

export function BoardDimensionIcon({ name, size = 20 }: { name: ScenarioBoardIcon; size?: number }) {
  const Icon = ICONS[name];
  return <Icon size={size} weight="regular" aria-hidden />;
}
