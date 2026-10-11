/**
 * [INPUT]: 依赖场景视图、榜单筛选与页面框架
 * [OUTPUT]: 对外提供场景列表、场景榜单与 metadata
 * [POS]: src/views 的场景页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { BoardCard } from "@/components/board-card";
import { Frame } from "@/components/frame";
import { FusedTable } from "@/components/fused-table";
import { ScenarioComboGrid } from "@/components/scenario-combo-grid";
import { ScenarioHero } from "@/components/scenario-hero";
import { VendorMark } from "@/components/vendor-mark";
import { getScenario, listScenarioCards, slugs } from "@/lib/catalog";
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
  const cards = listScenarioCards(locale);
  return (
    <Frame locale={locale} width="home">
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.lists.scenariosTitle}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.lists.scenariosBody}</p>
      </section>
      <div className="mt-10 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => <BoardCard key={card.href} card={card} viewMore={dict.home.viewMore} />)}
      </div>
    </Frame>
  );
}

export async function ScenarioView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scenario = getScenario(locale, slug);
  if (!scenario) notFound();
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale} width="home">
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/scenarios")} className="num hover:text-fg">{dict.nav.scenarios}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{scenario.slug}</span>
      </section>
      <ScenarioHero
        title={scenario.title}
        thesis={scenario.thesis}
        takeaway={scenario.takeaway}
        scoring={scenario.scoring}
        dict={dict}
        stale={scenario.stale}
      />
      {scenario.fusion.rows.length ? (
        <section className="pt-10">
          <FusedTable
            fusion={scenario.fusion}
            dict={dict}
            syncLabel={dict.scenario.synced.replace("{date}", scenario.syncDate)}
          />
        </section>
      ) : null}
      {scenario.comboSection ? (
        <ScenarioComboGrid
          title={dict.scenario.combo}
          href={scenario.comboSection.href}
          items={scenario.comboSection.items}
          dict={dict}
        />
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
