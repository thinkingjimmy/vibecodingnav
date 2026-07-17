/**
 * [INPUT]: 依赖 clsx 的条件类名合并与 tailwind-merge 的样式冲突解析
 * [OUTPUT]: 对外提供 shadcn UI primitives 共用的 cn 类名合并函数
 * [POS]: src/lib 的 UI 工具叶子，只解决 Tailwind 类名组合，不承载业务逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
