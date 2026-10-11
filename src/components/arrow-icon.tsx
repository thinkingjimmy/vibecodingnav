/**
 * [INPUT]: 依赖 Phosphor ArrowRight
 * [OUTPUT]: 对外提供可在服务端页面里使用的箭头
 * [POS]: src/components 的客户端图标边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { ArrowRight } from "@phosphor-icons/react";

export function ArrowIcon({ size, className }: { size: number; className?: string }) {
  return <ArrowRight size={size} className={className} />;
}
