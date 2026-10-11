/**
 * [INPUT]: 依赖字典与站点路径
 * [OUTPUT]: 对外提供页脚导航与版权
 * [POS]: src/components 的全站页脚
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/contracts";
import { localePath } from "@/lib/locale";
import { SUGGEST_URL } from "@/lib/site";

export function SiteFooter({ locale, dict, width }: { locale: Locale; dict: Dictionary; width: "home" | "page" }) {
  return (
    <footer className="mt-28 border-t border-line">
      <div className={`mx-auto flex h-16 w-full items-center gap-5 px-4 text-[12px] text-mfg ${width === "home" ? "max-w-[1200px]" : "max-w-[960px]"}`}>
        <Link href={localePath(locale, "/")} className="num text-fg">vibecodingnav</Link>
        <Link href={localePath(locale, "/benchmarks")} className="num hover:text-fg">{dict.footer.method}</Link>
        <Link href={`${localePath(locale, "/")}#sources`} className="num hover:text-fg">{dict.footer.sources}</Link>
        <Link href={localePath(locale, "/changes")} className="num hover:text-fg">{dict.footer.changes}</Link>
        <a href={SUGGEST_URL} className="num hover:text-fg">{dict.footer.suggest}</a>
        <span className="num ml-auto hidden sm:inline">{dict.footer.legal}</span>
      </div>
    </footer>
  );
}
