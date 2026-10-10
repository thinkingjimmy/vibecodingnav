/**
 * [INPUT]: 依赖首页目录视图、页面框架与字典
 * [OUTPUT]: 对外提供首页与其 metadata
 * [POS]: src/views 的首页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { Frame } from "@/components/frame";
import { RichText } from "@/components/rich-text";
import { VendorMark } from "@/components/vendor-mark";
import { getHome } from "@/lib/catalog";
import type { Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/site";

export function homeMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/", dict.meta.title, dict.meta.description);
}

export function HomeView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const home = getHome(locale);
  return (
    <Frame locale={locale} width="home">
      <section className="px-4 pt-16 pb-4 sm:pt-24">
        <h1 className="display">{dict.home.heroTitle}</h1>
        <p className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-mfg">{dict.home.heroBody}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          <span className="text-faint">{dict.home.start}</span>
          {home.starts.map((link, index) => (
            <Link key={link.href} href={link.href} className={index === 0 ? "link-u font-medium" : "link-u text-mfg"}>{link.title}</Link>
          ))}
          <span className="num text-[12px] text-faint">{dict.home.startNote}</span>
        </div>
      </section>
      <section className="pt-16">
        <header className="flex items-end justify-between px-4 pb-6">
          <h2 className="pt">{dict.home.boards}</h2>
          <span className="num pb-1 text-[12px] text-faint">{dict.home.boardsNote}</span>
        </header>
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {home.cards.map((card) => (
            <Link key={card.href} href={card.href} className="card group">
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-medium tracking-[-0.01em]">{card.title}</span>
                  <ArrowIcon size={14} className="text-faint transition-colors group-hover:text-fg" />
                </div>
                <div className="num mt-1 text-[11px] text-faint">{card.source}</div>
              </div>
              <div className="flex-1 px-4">
                {card.rows.map((row, index) => (
                  <div key={row.name} className={`flex h-9 items-center gap-2.5 text-[13.5px] ${index ? "border-t border-line" : ""}`}>
                    <span className="num w-3 text-[11px] text-faint">{row.rank}</span>
                    <VendorMark vendor={row.vendor} />
                    <span className={`truncate ${index ? "" : "font-medium"}`}>{row.name}</span>
                    {"license" in row && row.license ? <span className="num text-[10.5px] text-faint">{row.license}</span> : null}
                    {"reason" in row ? <span className="ml-auto text-[12px] whitespace-nowrap text-mfg">{row.reason}</span> : (
                      <span className={`num ml-auto ${index ? "text-mfg" : ""}`}>
                        {"score" in row ? row.score : ""}
                        {"unit" in row && row.unit ? <span className="text-[11px] text-faint">{row.unit}</span> : null}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex h-10 items-center border-t border-line px-4 text-[12.5px] text-mfg group-hover:text-fg">
                {card.action}<span className="ml-1">→</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6 px-4 pt-6 text-[14px] text-mfg">
          <Link href={locale === "zh" ? "/zh/scenarios/" : "/scenarios/"} className="link-u text-fg">{dict.home.allScenarios}</Link>
          {home.also.length ? <span>{dict.home.also}：{home.also.map((link) => <Link key={link.href} href={link.href} className="link-u">{link.title}</Link>)}</span> : null}
        </div>
      </section>
      <section className="pt-20">
        <header className="flex items-end justify-between px-4 pb-8">
          <h2 className="pt">{dict.home.toolbox}</h2>
          <span className="num pb-1 text-[12px] text-faint">{dict.home.toolboxNote}</span>
        </header>
        <div className="grid grid-cols-1 gap-x-10 gap-y-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.categories.map((category) => (
            <div key={category.href}>
              <Link href={category.href} className="group flex items-center justify-between text-[15px] font-medium">
                {category.title}
                <ArrowIcon size={14} className="text-faint group-hover:text-fg" />
              </Link>
              <div className="mt-3 space-y-2">
                {category.items.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2 text-[14px] text-mfg hover:text-fg">
                    <span className="truncate">{item.name}</span>
                    <span className="ml-auto"><span className="tag">{item.type}</span></span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pt-8 text-[14px]"><Link href={locale === "zh" ? "/zh/tools/" : "/tools/"} className="link-u">{dict.home.allCategories}</Link></div>
      </section>
      <section className="pt-20">
        <header className="px-4 pb-6"><h2 className="pt">{dict.home.changes}</h2></header>
        <div className="mx-4">
          {home.changes.map((change, index) => (
            <div key={`${change.date}-${change.kind}-${index}`} className={`rowh grid grid-cols-1 items-baseline gap-1 py-3 text-[14px] sm:grid-cols-[64px_64px_1fr_130px] sm:gap-0 ${index < home.changes.length - 1 ? "border-b border-line" : ""}`}>
              <span className="num text-[12px] text-mfg">{change.date}</span>
              <span className={`num text-[12px] ${change.kindId === "board" ? "text-faint" : "text-fg"}`}>{change.kind}</span>
              <span className="pr-6 leading-relaxed"><RichText text={change.text} /></span>
              <span className="num text-right text-[11px] text-faint">{change.source}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-4 pt-5">
          <Link href={locale === "zh" ? "/zh/changes/" : "/changes/"} className="pill">{dict.home.allChanges}</Link>
          <a href="/feed.xml" className="pill">{dict.home.rss}</a>
        </div>
      </section>
      <section id="sources" className="px-4 pt-20">
        <header className="pb-3"><h2 className="pt">{dict.home.sources}</h2></header>
        <p className="text-[14px] text-mfg">{dict.home.sourcesNote}</p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {home.sources.map((source) => (
            <Link key={source.href} href={source.href}>
              <div className={`text-[14px] font-medium ${source.stale ? "text-faint" : ""}`}>{source.name}</div>
              <div className={`num mt-2 text-[12px] ${source.stale ? "text-faint" : "text-mfg"}`}>{source.date}</div>
              <div className={`num text-[11px] ${source.stale ? "text-faint" : "text-mfg"}`}>{source.note}</div>
            </Link>
          ))}
        </div>
      </section>
    </Frame>
  );
}
