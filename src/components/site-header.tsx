/**
 * [INPUT]: 依赖字典、搜索条目、Phosphor 图标与 Base UI Dialog
 * [OUTPUT]: 对外提供置顶导航、语言切换、主题与 ⌘K 搜索；关闭搜索后焦点回到按钮但不画焦点环
 * [POS]: src/components 的全站页头
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, CircleHalf, MagnifyingGlass, TerminalWindow } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/contracts";
import type { SearchEntry } from "@/lib/catalog";
import { localePath, swapLocale } from "@/lib/locale";
import { activeNav } from "@/lib/nav";

const links = [
  ["scenarios", "/scenarios"],
  ["models", "/models"],
  ["tools", "/tools"],
  ["builds", "/build"],
  ["benchmarks", "/benchmarks"],
] as const;

function restoreFocusQuietly(node: HTMLElement | null) {
  if (!node) return;
  node.dataset.restoreFocus = "";
  node.focus({ preventScroll: true, focusVisible: false });
  const clear = () => {
    delete node.dataset.restoreFocus;
    node.removeEventListener("blur", clear);
  };
  node.addEventListener("blur", clear);
}

export function SiteHeader({ locale, dict, entries }: { locale: Locale; dict: Dictionary; entries: SearchEntry[] }) {
  const path = usePathname() || "/";
  const headerRef = useRef<HTMLElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    const node = headerRef.current;
    if (!node) return;
    const apply = () => document.documentElement.style.setProperty("--site-nav", `${node.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries.slice(0, 8);
    return entries.filter((entry) => entry.haystack.includes(needle)).slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = activeNav(path);
  const nav = (
    <nav aria-label={dict.nav.primary} className="flex items-center gap-5 text-[14px] font-medium text-mfg">
      {links.map(([key, href]) => (
        <Link key={key} href={localePath(locale, href)} className={current === key ? "text-fg" : "hover:text-fg"} aria-current={current === key ? "page" : undefined}>
          {dict.nav[key]}
        </Link>
      ))}
    </nav>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center gap-3 px-4">
        <Link href={localePath(locale, "/")} className="flex items-center gap-2.5 text-[15px] font-medium tracking-tight">
          <TerminalWindow size={22} aria-hidden="true" />
          vibecodingnav
        </Link>
        <div className="hidden flex-1 lg:block" />
        <div className="hidden lg:block">{nav}</div>
        <div className="flex-1 lg:hidden" />
        <span className="mx-1 hidden h-5 w-px bg-bd sm:block" />
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger ref={searchTriggerRef} className="flex items-center gap-2 text-[14px] text-mfg hover:text-fg" aria-label={dict.nav.search}>
            <MagnifyingGlass size={15} />
            <span className="kbd">⌘</span>
            <span className="kbd -ml-1">K</span>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-fg/20" />
            <Dialog.Popup
              finalFocus={() => {
                restoreFocusQuietly(searchTriggerRef.current);
                return false;
              }}
              className="fixed top-[12vh] left-1/2 z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-[12px] border border-bd bg-bg shadow-none"
            >
              <Dialog.Title className="sr-only">{dict.search.title}</Dialog.Title>
              <Dialog.Description className="sr-only">{dict.search.placeholder}</Dialog.Description>
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dict.search.placeholder}
                className="h-12 w-full bg-transparent px-4 text-[15px] placeholder:text-faint"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0]) {
                    setOpen(false);
                    router.push(results[0].href);
                  }
                }}
              />
              <div className="max-h-80 overflow-auto border-t border-line">
                {results.length === 0 ? <p className="px-4 py-6 text-[14px] text-mfg">{dict.search.empty}</p> : null}
                {results.map((entry) => (
                  <Link key={entry.href} href={entry.href} onClick={() => setOpen(false)} className="rowh flex items-center gap-3 px-4 py-2.5 text-[14px]">
                    <span className="num w-16 shrink-0 text-[11px] text-faint">{entry.kicker}</span>
                    <span className="truncate">{entry.title}</span>
                    <ArrowRight className="ml-auto text-faint" size={14} />
                  </Link>
                ))}
              </div>
              <Dialog.Close className="sr-only">{dict.search.close}</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <span className="mx-1 hidden h-5 w-px bg-bd sm:block" />
        <span className="num text-[12px] text-mfg">
          <Link href={swapLocale(path, "zh")} className={locale === "zh" ? "text-fg" : "hover:text-fg"} hrefLang="zh">中</Link>
          <span className="px-1 text-faint">/</span>
          <Link href={swapLocale(path, "en")} className={locale === "en" ? "text-fg" : "hover:text-fg"} hrefLang="en">EN</Link>
        </span>
        <span className="mx-1 h-5 w-px bg-bd" />
        <button
          type="button"
          aria-label={dict.nav.theme}
          className="grid size-8 place-items-center"
          onClick={() => {
            const next = !document.documentElement.classList.contains("dark");
            document.documentElement.classList.toggle("dark", next);
            localStorage.setItem("theme", next ? "dark" : "light");
          }}
        >
          <CircleHalf size={16} />
        </button>
      </div>
      <div className="mx-auto w-full max-w-[1200px] overflow-x-auto px-4 pb-3 lg:hidden">{nav}</div>
    </header>
  );
}
