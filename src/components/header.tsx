/**
 * [INPUT]: 依赖 next/image、SITE_ICON 共享品牌资产、当前 Locale、Dictionary 的导航/语言文案与 LanguageSelect 客户端组件
 * [OUTPUT]: 对外提供紧凑置顶的品牌字标、桌面端页内主导航与地球图标语言菜单
 * [POS]: src/components 的页面头部 Server Component，仅承担全局导航与品牌识别
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";
import { LanguageSelect } from "./language-select";
import type { Dictionary, Locale } from "@/lib/contracts";
import { localePath, SITE_ICON } from "@/lib/site";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function Header({ locale, dictionary }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-5 py-2 sm:gap-4 sm:py-2.5">
        <a
          aria-label="AIEvalIndex"
          className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-sm"
          href={localePath(locale)}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-8 shrink-0 sm:size-9"
            height={40}
            src={SITE_ICON.url}
            unoptimized
            width={40}
          />
          <span className="translate-y-[2px] whitespace-nowrap font-serif text-3xl leading-none tracking-[-.035em] text-ink">
            <span className="font-semibold">AI Eval</span>{" "}
            <span className="font-normal italic text-ink-soft transition-colors group-hover:text-ink">
              Index
            </span>
          </span>
        </a>
        <nav aria-label="Primary" className="mr-2 hidden items-center gap-8 md:flex">
          <a className="header-nav-link" href="#models">{dictionary.header.models}</a>
          <a className="header-nav-link" href="#leaderboard">{dictionary.header.leaderboard}</a>
          <a className="header-nav-link" href="#methodology">{dictionary.header.methodology}</a>
        </nav>
        <LanguageSelect ariaLabel={dictionary.header.language} locale={locale} />
      </div>
    </header>
  );
}
