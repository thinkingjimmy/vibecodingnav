/**
 * [INPUT]: 依赖场景视图、榜单筛选与页面框架
 * [OUTPUT]: 对外提供场景列表、场景榜单与 metadata
 * [POS]: src/views 的场景页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/frame";
import { Leaderboard } from "@/components/leaderboard";
import { VendorMark } from "@/components/vendor-mark";
import { getScenario, listScenarios, slugs } from "@/lib/catalog";
import type { Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/site";

export function scenarioParams() {
  return slugs("scenarios").map((slug) => ({ slug }));
}

export async function scenarioMetadata(locale: Locale, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const scenario = getScenario(locale, slug);
  const dict = getDictionary(locale);
  if (!scenario) return {};
  return pageMetadata(locale, `/scenarios/${slug}`, scenario.title, scenario.summary || dict.meta.description);
}

export function ScenarioIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rows = listScenarios(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.lists.scenariosTitle}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.lists.scenariosBody}</p>
      </section>
      <div className="mx-4 mt-10 border-t border-line">
        {rows.map((row) => (
          <Link key={row.href} href={row.href} className="rowh block border-b border-line py-4">
            <span className="text-[16px] font-medium">{row.title}</span>
            <span className="mt-1 block text-[14px] leading-relaxed text-mfg">{row.summary}</span>
          </Link>
        ))}
      </div>
    </Frame>
  );
}

export async function ScenarioView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(locale, slug);
  if (!scenario) notFound();
  const dict = getDictionary(locale);
  const priceKind = scenario.rows.some((row) => row.price?.includes("/")) ? "token" : "run";
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/scenarios")} className="num hover:text-fg">{dict.nav.scenarios}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{scenario.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <h1 className="display-page">{scenario.title}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{scenario.summary}</p>
        <p className="num mt-6 text-[12px] text-faint">{scenario.meta}</p>
        {scenario.note ? <p className="mt-4 max-w-[700px] text-[14px] leading-relaxed text-mfg">{scenario.note}</p> : null}
        {scenario.stale ? <p className="mt-4 text-[14px] text-mfg" data-stale="true">{dict.scenario.staleBanner}</p> : null}
      </section>
      {scenario.combo ? (
        <Link href={scenario.combo.href} className="group mx-4 mt-10 flex h-12 items-center gap-4 rounded-[10px] border border-bd px-4 text-[14px] hover:border-fg/20">
          <span className="font-medium">{dict.scenario.combo}</span>
          <span className="truncate text-mfg">{scenario.combo.label}</span>
          <span className="ml-auto text-faint group-hover:text-fg">{dict.scenario.viewCombo} →</span>
        </Link>
      ) : null}
      {scenario.rows.length ? (
        <section className="pt-16">
          <header className="px-4 pb-5"><h2 className="pt">{dict.scenario.board}</h2></header>
          <Leaderboard rows={scenario.rows} dict={dict} priceKind={priceKind} showFilters={scenario.showFilters} />
          <div className="flex flex-wrap items-center gap-4 px-4 pt-5">
            {scenario.partial ? <span className="num text-[12px] text-faint">{scenario.partial}</span> : null}
            <span className="num text-[12px] text-faint">{dict.scenario.rankNote}</span>
          </div>
        </section>
      ) : null}
      {scenario.picks.length ? (
        <section className="px-4 pt-16">
          <header className="pb-6"><h2 className="pt">{dict.scenario.picks}</h2></header>
          <div className="border-t border-line">
            {scenario.picks.map((pick) => (
              <Link key={pick.href} href={pick.href} className="rowh flex items-center gap-3 border-b border-line py-3">
                <VendorMark vendor={pick.vendor} />
                <span className="font-medium">{pick.name}</span>
                <span className="ml-auto text-[14px] text-mfg">{pick.reason}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      {scenario.explain.length ? (
        <section className="px-4 pt-20">
          <header className="pb-8"><h2 className="pt">{dict.scenario.explain}</h2></header>
          <dl className="max-w-[820px]">
            {scenario.explain.map(([label, body], index) => (
              <div key={label} className={`grid gap-3 py-4 md:grid-cols-[120px_1fr] md:gap-6 ${index ? "border-t border-line" : ""}`}>
                <dt className="text-[15px] font-medium">{label}</dt>
                <dd className="text-[15px] leading-relaxed text-mfg">{body}</dd>
              </div>
            ))}
            <div className="grid gap-3 border-t border-line py-4 md:grid-cols-[120px_1fr] md:gap-6">
              <dt className="text-[15px] font-medium">{dict.benchmark.source}</dt>
              <dd className="flex flex-col gap-1 text-[13px] text-mfg">
                {scenario.links.map((link) => <a key={link.href} href={link.href} className="num link-u">{link.label}</a>)}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
      <section className="px-4 pt-20">
        <header className="pb-8"><h2 className="pt">{dict.scenario.why}</h2></header>
        <div className="grid gap-10 md:grid-cols-3">
          {scenario.why.map((item) => (
            <div key={item.title}>
              <h3 className="text-[16px] font-medium">{item.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mfg">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 pt-20">
        <header className="pb-5"><h2 className="pt">{dict.scenario.others}</h2></header>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          {scenario.related.map((link) => <Link key={link.href} href={link.href} className="link-u">{link.title}</Link>)}
        </div>
      </section>
    </Frame>
  );
}

export function scenariosMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/scenarios", dict.lists.scenariosTitle, dict.lists.scenariosBody);
}
