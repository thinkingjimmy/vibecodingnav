/**
 * [INPUT]: 依赖 LOCALES/isLocale、动态 locale 参数与 src/app/shell.tsx 的 DocumentShell
 * [OUTPUT]: 对外提供五种非默认语言静态参数与对应 lang 属性的 HTML 文档
 * [POS]: src/app/[locale] 的根布局，是带语言前缀模型页面的静态生成边界
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LOCALES } from "@/lib/contracts";
import { isLocale } from "@/lib/locale";
import { DocumentShell } from "../shell";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  return <DocumentShell lang={locale}>{children}</DocumentShell>;
}
