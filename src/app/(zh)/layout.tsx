/**
 * [INPUT]: 依赖 DocumentShell、字典与站点常量
 * [OUTPUT]: 对外提供 中文根布局与默认 metadata
 * [POS]: src/app/(zh) 的文档根，页面不带第二套 html
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DocumentShell } from "../shell";

const dict = getDictionary("zh");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${dict.meta.title} · ${SITE_NAME}`, template: `%s · ${SITE_NAME}` },
  description: dict.meta.description,
  icons: { icon: "/favicon.svg" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DocumentShell lang="zh">{children}</DocumentShell>;
}
