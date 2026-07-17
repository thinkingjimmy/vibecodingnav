/**
 * [INPUT]: 依赖 src/app/globals.css、Google Fonts 外部样式与 Locale 契约
 * [OUTPUT]: 对外提供 DocumentShell 统一 HTML 文档外壳（字体声明 + body 基础样式）
 * [POS]: src/app 的文档外壳单一真相源，被 (root) 与 [locale] 两套根布局共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
/* eslint-disable @next/next/no-page-custom-font -- 多根 App Router 布局共享同一字体资源声明 */
import type { ReactNode } from "react";
import type { Locale } from "@/lib/contracts";
import "./globals.css";

export function DocumentShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
