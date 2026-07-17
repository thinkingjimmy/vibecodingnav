/**
 * [INPUT]: 依赖 src/app/shell.tsx 的 DocumentShell 文档外壳
 * [OUTPUT]: 对外提供根路径语言检测页的英文 HTML 文档
 * [POS]: src/app/(root) 的根布局，与 [locale] 布局共同组成多根静态路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ReactNode } from "react";
import { DocumentShell } from "../shell";

export default function RootLayout({ children }: { children: ReactNode }) {
  return <DocumentShell lang="en">{children}</DocumentShell>;
}
