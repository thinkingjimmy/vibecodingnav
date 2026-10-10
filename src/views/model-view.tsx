/**
 * [INPUT]: 依赖模型视图与页面框架
 * [OUTPUT]: 对外提供模型列表、模型详情与 metadata
 * [POS]: src/views 的模型页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { ArrowIcon } from "@/components/arrow-icon";
import { notFound } from "next/navigation";
import { Frame } from "@/components/frame";
import { VendorMark } from "@/components/vendor-mark";
import { getModel, listModels, slugs } from "@/lib/catalog";
import type { Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/site";

export function modelParams() {
  return slugs("models").map((slug) => ({ slug }));
}

export function modelsMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/models", dict.lists.modelsTitle, dict.lists.modelsBody);
}

export async function modelMetadata(locale: Locale, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const model = getModel(locale, slug);
  if (!model) return {};
  return pageMetadata(locale, `/models/${slug}`, model.name, model.summary);
}

export function ModelIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rows = listModels(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.lists.modelsTitle}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.lists.modelsBody}</p>
      </section>
      <div className="mx-4 mt-10 overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="num grid h-9 grid-cols-[1fr_120px_140px_80px_120px] items-center border-b border-line text-[12px] text-faint">
            <span>{dict.scenario.colModel}</span><span>{dict.model.colRank}</span><span>{dict.scenario.colPrice}</span><span>{dict.scenario.colContext}</span><span />
          </div>
          {rows.map((row) => (
            <Link key={row.href} href={row.href} className="rowh grid h-12 grid-cols-[1fr_120px_140px_80px_120px] items-center border-b border-line text-[14px]">
              <span className="flex items-center gap-2 font-medium"><VendorMark vendor={row.vendor} />{row.name}</span>
              <span className="num text-mfg">{row.best}</span>
              <span className="num text-mfg">{row.price}</span>
              <span className="num text-mfg">{row.context}</span>
              <span className="num text-right text-[11px] text-faint">{row.license}</span>
            </Link>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export async function ModelView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const model = getModel(locale, slug);
  if (!model) notFound();
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/models")} className="num hover:text-fg">{dict.nav.models}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{model.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <span className="grid size-11 place-items-center rounded-full border border-bd"><VendorMark vendor={model.vendor} className="size-6" /></span>
          <h1 className="display-page">{model.name}</h1>
        </div>
        <p className="mt-5 max-w-[720px] text-[17px] leading-relaxed text-mfg">{model.summary}</p>
        <p className="num mt-6 text-[12px] text-faint">{model.meta}</p>
      </section>
      {model.stats.length ? (
        <section className="grid gap-10 px-4 pt-20 sm:grid-cols-3">
          {model.stats.map((stat) => (
            <div key={stat.label}>
              <Link href={stat.href} className="num text-[12px] text-mfg link-u">{stat.label}</Link>
              <div className="num mt-3 text-[40px] leading-none font-medium tracking-tight">
                {stat.score}{stat.unit ? <span className="text-[18px] text-faint">{stat.unit}</span> : null}
              </div>
              <div className="num mt-3 text-[12px] text-mfg">{stat.meta}</div>
            </div>
          ))}
        </section>
      ) : null}
      <section className="pt-20">
        <header className="flex items-end justify-between px-4 pb-6">
          <h2 className="pt">{dict.model.scores}</h2>
          <span className="num pb-2 text-[12px] text-faint">{dict.model.scoresNote}</span>
        </header>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="num grid h-9 grid-cols-[200px_160px_1fr_56px_70px_96px] items-center gap-3 border-b border-line px-4 text-[12px] text-faint">
              <span>{dict.model.colBench}</span><span>{dict.model.colSetting}</span><span>{dict.model.colScore}</span>
              <span className="text-right">{dict.model.colRank}</span><span className="text-right">{dict.model.colCost}</span><span className="text-right">{dict.model.colDate}</span>
            </div>
            {model.scoreRows.map((row, index) => (
              <div key={row.name} data-stale={row.stale ? "true" : "false"} className={`rowh grid h-12 grid-cols-[200px_160px_1fr_56px_70px_96px] items-center gap-3 px-4 text-[14px] ${index < model.scoreRows.length - 1 ? "border-b border-line" : ""} ${row.stale && !row.score ? "text-faint" : ""}`}>
                <Link href={row.href} className={`font-medium link-u ${row.stale && !row.score ? "text-faint" : ""}`}>{row.name}</Link>
                <span className="num text-[12px] text-mfg">{row.setting}</span>
                {row.score ? (
                  <span className="flex items-center gap-3">
                    <span className="num w-14">{row.score}</span>
                    <span className="h-1.5 flex-1 rounded-[1px] bg-muted"><i className="block h-full rounded-[1px] bg-bar" style={{ width: `${row.width}%` }} /></span>
                    <span className="num w-16 text-[11px] text-faint">{row.ci}</span>
                  </span>
                ) : <span className="num text-[12px]">{row.note}</span>}
                <span className="num text-right">{row.rank}</span>
                <span className="num text-right">{row.cost}</span>
                <span className="num text-right text-[12px] text-mfg">{row.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="pt-20">
        <header className="px-4 pb-6"><h2 className="pt">{dict.model.choose}</h2></header>
        <div className="grid gap-10 text-[14px] leading-relaxed md:grid-cols-2">
          <Choice title={dict.model.why} filled items={model.why} />
          <Choice title={dict.model.whyNot} items={model.whyNot} />
        </div>
      </section>
      <section className="pt-20">
        <header className="flex items-end justify-between px-4 pb-6">
          <h2 className="pt">{dict.model.appears}</h2>
          <span className="num pb-2 text-[12px] text-faint">{dict.model.appearsNote}</span>
        </header>
        <div>
          {model.appearances.map((row, index) => (
            <Link key={row.href} href={row.href} className={`rowh grid items-center gap-3 px-4 h-12 sm:grid-cols-[1fr_180px_200px_36px] ${index < model.appearances.length - 1 ? "border-b border-line" : "border-y border-line"}`}>
              <span className="text-[15px] font-medium">{row.title}</span>
              <span className="num text-[12px] text-mfg">{row.role}</span>
              <span className="num text-[12px] text-mfg">{row.detail}</span>
              <ArrowIcon size={15} className="justify-self-end text-faint" />
            </Link>
          ))}
        </div>
      </section>
      {model.builds.length ? (
        <section className="px-4 pt-20">
          <header className="pb-5"><h2 className="pt">{dict.model.inBuilds}</h2></header>
          {model.builds.map((build) => (
            <Link key={build.href} href={build.href} className="rowh flex h-12 items-center gap-4 border-y border-line">
              <span className="text-[15px] font-medium">{build.title}</span>
              <span className="truncate text-[14px] text-mfg">{build.detail}</span>
              <span className="ml-auto text-faint">→</span>
            </Link>
          ))}
        </section>
      ) : null}
      {model.peers.rows.length > 1 ? (
        <section className="pt-20">
          <header className="px-4 pb-6"><h2 className="pt">{dict.model.peers}</h2></header>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="num grid h-9 grid-cols-[1fr_repeat(var(--peer-cols),minmax(0,150px))] items-center border-b border-line px-4 text-[12px] text-faint" style={{ ["--peer-cols" as string]: model.peers.columns.length + 1 }}>
                <span>{dict.scenario.colModel}</span>
                {model.peers.columns.map((column) => <span key={column} className="text-right">{column}</span>)}
                <span className="text-right">{dict.scenario.colPrice}</span>
              </div>
              {model.peers.rows.map((row, index) => (
                <Link key={row.href} href={row.href} className={`rowh grid h-11 grid-cols-[1fr_repeat(var(--peer-cols),minmax(0,150px))] items-center px-4 text-[14px] ${row.current ? "bg-surface" : ""} ${index < model.peers.rows.length - 1 ? "border-b border-line" : ""}`} style={{ ["--peer-cols" as string]: model.peers.columns.length + 1 }}>
                  <span className="flex items-center gap-2 font-medium">
                    <VendorMark vendor={row.vendor} />{row.name}
                    {row.current ? <span className="num ml-1 text-[11px] font-normal text-faint">{dict.model.current}</span> : null}
                  </span>
                  {row.scores.map((score, scoreIndex) => <span key={scoreIndex} className="num text-right">{score}</span>)}
                  <span className="num text-right text-mfg">{row.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Frame>
  );
}

function Choice({ title, items, filled = false }: { title: string; items: string[]; filled?: boolean }) {
  return (
    <div>
      <div className="flex h-10 items-center gap-2 border-b border-line px-4 text-[14px] font-medium">
        <span className={`size-1.5 rounded-full ${filled ? "bg-fg" : "border border-fg"}`} />
        {title}
      </div>
      <ul className="divide-y divide-line">
        {items.map((item) => <li key={item} className="px-4 py-3">{item}</li>)}
      </ul>
    </div>
  );
}
