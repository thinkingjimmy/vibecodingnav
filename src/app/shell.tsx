/**
 * [INPUT]: 依赖 Geist 字体、全局样式与语言
 * [OUTPUT]: 对外提供带主题启动脚本的 HTML 文档外壳
 * [POS]: src/app 的文档外壳，英文与中文两套根布局共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const themeBoot = `try{var t=localStorage.getItem("theme");if(t==="dark"||/[?&]theme=dark/.test(location.search))document.documentElement.classList.add("dark")}catch(e){}`;

export function DocumentShell({ lang, children }: { lang: "en" | "zh"; children: ReactNode }) {
  return (
    <html lang={lang === "zh" ? "zh-CN" : "en"} className={`${sans.variable} ${mono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-bg font-sans text-[15px] text-fg antialiased">
        <Script id="theme-boot" strategy="beforeInteractive">{themeBoot}</Script>
        {children}
      </body>
    </html>
  );
}
