/**
 * [INPUT]: 依赖 next/image、SITE_ICON 共享品牌资产、当前 Locale、Dictionary 与 LanguageSelect 客户端组件
 * [OUTPUT]: 对外提供含本地化营销副标题的编辑部品牌锁定组合与地球图标语言菜单
 * [POS]: src/components 的页面头部 Server Component，负责品牌识别并把最小交互下沉给 LanguageSelect
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
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-5 py-3 sm:gap-4 sm:py-3.5">
        <a
          aria-label="AIEvalIndex"
          className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:gap-3"
          href={localePath(locale)}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="size-[34px] shrink-0 sm:size-10"
            height={40}
            src={SITE_ICON.url}
            unoptimized
            width={40}
          />
          <span className="min-w-0">
            <span className="block whitespace-nowrap font-serif text-[21px] leading-none tracking-[-.035em] text-ink sm:text-[27px]">
              <span className="font-semibold">AI Eval</span>{" "}
              <span className="font-normal italic text-ink-soft transition-colors group-hover:text-ink">
                Index
              </span>
            </span>
            <span className="mt-1 block min-h-6 text-balance font-sans text-[10px] font-medium leading-[1.2] tracking-[.01em] text-ink-soft sm:min-h-0 sm:text-[11px] sm:leading-[1.15]">
              {dictionary.header.tagline}
            </span>
          </span>
        </a>
        <LanguageSelect ariaLabel={dictionary.header.language} locale={locale} />
      </div>
    </header>
  );
}
