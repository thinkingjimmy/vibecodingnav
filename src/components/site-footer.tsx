/**
 * [INPUT]: Localized dictionary and site paths.
 * [OUTPUT]: Footer navigation and copyright, with wrapping links on narrow screens.
 * [POS]: Shared site footer used by Frame.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/contracts";
import { localePath } from "@/lib/locale";
import { SUGGEST_URL } from "@/lib/site";

export function SiteFooter({ locale, dict, width }: { locale: Locale; dict: Dictionary; width: "home" | "page" }) {
  return (
    <footer className="mt-28 border-t border-line">
      <div className={`mx-auto flex min-h-16 w-full flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 text-[12px] text-mfg [&>a]:whitespace-nowrap ${width === "home" ? "max-w-[1200px]" : "max-w-[960px]"}`}>
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
