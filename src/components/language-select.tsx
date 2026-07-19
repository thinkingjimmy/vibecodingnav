/**
 * [INPUT]: 依赖 Locale/LOCALES、ModelSlug、语言元数据、modelPath、Phosphor GlobeIcon 与 Base UI DropdownMenu
 * [OUTPUT]: 对外提供无底色地球触发、原生语言单选菜单、本地记忆与同模型语言路由切换
 * [POS]: src/components 的语言交互叶子，只组合 UI primitive 与路由行为，不持有页面业务状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { GlobeIcon } from "@phosphor-icons/react/dist/csr/Globe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, type Locale } from "@/lib/contracts";
import { isLocale } from "@/lib/locale";
import type { ModelSlug } from "@/lib/model";
import { modelPath, LOCALE_METADATA } from "@/lib/site";

interface LanguageSelectProps {
  ariaLabel: string;
  locale: Locale;
  modelSlug: ModelSlug;
}

export function LanguageSelect({ ariaLabel, locale, modelSlug }: LanguageSelectProps) {
  const changeLocale = (nextLocale: string) => {
    if (!isLocale(nextLocale) || nextLocale === locale) return;
    localStorage.setItem("lang", nextLocale);
    window.location.assign(modelPath(nextLocale, modelSlug));
  };

  const current = LOCALE_METADATA[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            aria-label={`${ariaLabel}: ${current.name}`}
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            type="button"
          />
        }
      >
        <GlobeIcon aria-hidden="true" size={20} weight="regular" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuRadioGroup onValueChange={changeLocale} value={locale}>
          {LOCALES.map((option) => {
            const metadata = LOCALE_METADATA[option];
            return (
              <DropdownMenuRadioItem key={option} value={option}>
                <span aria-hidden="true" className="text-base leading-none">
                  {metadata.flag}
                </span>
                <span>{metadata.name}</span>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
