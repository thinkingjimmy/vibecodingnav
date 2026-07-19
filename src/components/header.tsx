/**
 * [INPUT]: 依赖 next/image、SITE_ICON、当前 Locale/ModelSlug、Dictionary 与 ModelMenu/LanguageSelect 客户端叶子
 * [OUTPUT]: 对外提供品牌字标、桌面模型目录、页内导航与地球图标语言菜单
 * [POS]: src/components 的页面头部 Server Component，组合全局导航、模型发现与品牌识别
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";
import Link from "next/link";
import { LanguageSelect } from "./language-select";
import { ModelMenu } from "./model-menu";
import type { Dictionary, Locale } from "@/lib/contracts";
import type { ModelSlug } from "@/lib/model";
import { SITE_ICON } from "@/lib/site";

interface HeaderProps {
  locale: Locale;
  dictionary: Dictionary;
  modelSlug: ModelSlug;
}

export function Header({ locale, dictionary, modelSlug }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-5 py-2 sm:gap-4 sm:py-2.5">
        <Link
          aria-label="AIEvalIndex"
          className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-sm"
          href="/"
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
        </Link>
        <nav aria-label="Primary" className="mr-2 hidden items-center gap-8 md:flex">
          <ModelMenu currentModelSlug={modelSlug} label={dictionary.header.models} locale={locale} />
          <a className="header-nav-link" href="#leaderboard">{dictionary.header.leaderboard}</a>
          <a className="header-nav-link" href="#methodology">{dictionary.header.methodology}</a>
        </nav>
        <LanguageSelect ariaLabel={dictionary.header.language} locale={locale} modelSlug={modelSlug} />
      </div>
    </header>
  );
}
