/**
 * [INPUT]: 依赖 LocaleRedirect 的浏览器语言检测与英文无脚本兜底路径
 * [OUTPUT]: 对外提供带共享品牌图标的 / 根路径 noindex 跳转页
 * [POS]: src/app/(root) 的唯一页面，不承载模型内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Metadata } from "next";
import Link from "next/link";
import { LocaleRedirect } from "@/components/locale-redirect";
import { SITE_ICON } from "@/lib/site";

export const metadata: Metadata = {
  title: "AIEvalIndex",
  icons: {
    icon: SITE_ICON,
    shortcut: SITE_ICON,
    apple: SITE_ICON,
  },
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return (
    <>
      <LocaleRedirect />
      <noscript>
        <meta content="0; url=/en/" httpEquiv="refresh" />
        <Link href="/en/">AIEvalIndex — English</Link>
      </noscript>
    </>
  );
}
