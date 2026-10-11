/**
 * [INPUT]: 依赖页头、页脚与目录搜索索引
 * [OUTPUT]: 对外提供统一版心的页面框架
 * [POS]: src/components 的页面骨架
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { ReactNode } from "react";
import type { Locale } from "@/lib/contracts";
import { searchEntries } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function Frame({ locale, width = "page", children }: { locale: Locale; width?: "home" | "page"; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <>
      <SiteHeader locale={locale} dict={dict} entries={searchEntries(locale)} />
      <main className={`mx-auto w-full px-0 ${width === "home" ? "max-w-[1200px]" : "max-w-[960px]"}`}>{children}</main>
      <SiteFooter locale={locale} dict={dict} width={width} />
    </>
  );
}
