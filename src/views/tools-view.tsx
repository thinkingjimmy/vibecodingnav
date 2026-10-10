/**
 * [INPUT]: 依赖工具分类、条目详情与页面框架
 * [OUTPUT]: 对外提供工具箱、分类、条目详情与 metadata
 * [POS]: src/views 的工具页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryList } from "@/components/category-list";
import { Frame } from "@/components/frame";
import { PhosphorWeights } from "@/components/weights";
import { VendorMark } from "@/components/vendor-mark";
import { getCategory, getItem, itemSlugs, listCategories, slugs } from "@/lib/catalog";
import { ITEM_SEGMENT, type ItemType, type Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/site";

export function categoryParams() {
  return slugs("categories").map((slug) => ({ slug }));
}

export function itemParams(type: ItemType) {
  return itemSlugs(type).map((slug) => ({ slug }));
}

export function toolsMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/tools", dict.tools.indexTitle, dict.tools.indexBody);
}

export async function categoryMetadata(locale: Locale, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const category = getCategory(locale, slug);
  if (!category) return {};
  return pageMetadata(locale, `/tools/${slug}`, category.title, category.summary);
}

export async function itemMetadata(locale: Locale, type: ItemType, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const item = getItem(locale, type, slug);
  if (!item) return {};
  return pageMetadata(locale, `/${ITEM_SEGMENT[type]}/${slug}`, item.name, item.oneLiner);
}

export function ToolsIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const categories = listCategories(locale);
  return (
    <Frame locale={locale} width="home">
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.tools.indexTitle}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.tools.indexBody}</p>
      </section>
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 px-4 pt-14 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category.href}>
            <Link href={category.href} className="text-[16px] font-medium link-u">{category.title}</Link>
            <div className="mt-3 space-y-2">
              {category.items.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 text-[14px] text-mfg hover:text-fg">
                  <span className="truncate">{item.name}</span>
                  <span className="tag ml-auto">{item.type}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export async function CategoryView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(locale, slug);
  if (!category) notFound();
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/tools")} className="num hover:text-fg">{dict.nav.tools}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{category.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <h1 className="display-page">{category.title}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{category.summary}</p>
        <p className="num mt-6 text-[12px] text-faint">{category.meta}</p>
      </section>
      <section className="pt-14"><CategoryList rows={category.rows} dict={dict} /></section>
      <section className="px-4 pt-20">
        <header className="pb-6"><h2 className="pt">{dict.tools.how}</h2></header>
        <div className="max-w-[760px] space-y-4 text-[15px] leading-relaxed">
          {category.how.map((tip) => <p key={tip.title}><span className="font-medium">{tip.title}</span><span className="text-mfg">　{tip.body}</span></p>)}
        </div>
      </section>
      <section className="grid gap-10 px-4 pt-20 md:grid-cols-2">
        <div>
          <h3 className="text-[17px] font-medium">{dict.tools.inBuilds}</h3>
          <div className="mt-3 space-y-2">{category.builds.map((build) => <Link key={build.href} href={build.href} className="block link-u">{build.title}</Link>)}</div>
        </div>
        <div>
          <h3 className="text-[17px] font-medium">{dict.tools.others}</h3>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-mfg">{category.others.map((other) => <Link key={other.href} href={other.href} className="link-u">{other.title}</Link>)}</div>
        </div>
      </section>
    </Frame>
  );
}

export async function ItemView({ locale, type, params }: { locale: Locale; type: ItemType; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getItem(locale, type, slug);
  if (!item) notFound();
  const dict = getDictionary(locale);
  const category = item.categories[0];
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/tools")} className="num hover:text-fg">{dict.nav.tools}</Link>
        {category ? <><span className="num mx-2 text-faint">/</span><Link href={category.href} className="num hover:text-fg">{category.title}</Link></> : null}
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{item.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid size-11 place-items-center rounded-full border border-bd">
            {item.mark ? <VendorMark vendor={item.mark} className="size-6" /> : <span className="num text-[12px]">{item.name.slice(0, 1)}</span>}
          </span>
          <h1 className="display-page">{item.name}</h1>
          <span className="tag">{item.typeLabel}</span>
        </div>
        <p className="mt-5 max-w-[720px] text-[17px] leading-relaxed text-mfg">{item.oneLiner}</p>
        <p className="num mt-6 text-[12px] text-faint">{item.meta}</p>
      </section>
      {item.visual === "phosphor-weights" ? <section className="px-4 pt-14"><PhosphorWeights /></section> : null}
      {item.does.length ? (
        <section className="px-4 pt-20">
          <header className="pb-6"><h2 className="pt">{dict.item.does}</h2></header>
          <ul className="max-w-[780px] space-y-3.5 text-[15px] leading-relaxed">
            {item.does.map((row) => <li key={row.title} className="grid gap-3 md:grid-cols-[150px_1fr] md:gap-6"><span className="font-medium">{row.title}</span><span className="text-mfg">{row.body}</span></li>)}
          </ul>
        </section>
      ) : null}
      {item.install.length || item.usage ? (
        <section className="px-4 pt-20">
          <header className="pb-6"><h2 className="pt">{dict.item.install}</h2></header>
          <div className="grid items-start gap-6 md:grid-cols-2">
            {item.install.map((block) => <Code key={block.label} label={block.label} text={block.cmd} />)}
            {item.usage ? <Code label={item.usage.label} text={item.usage.cmd} /> : null}
          </div>
          {item.installNote ? <p className="mt-4 text-[13.5px] text-mfg">{item.installNote}</p> : null}
        </section>
      ) : null}
      {item.compatible.length ? (
        <section className="px-4 pt-20">
          <header className="pb-6"><h2 className="pt">{dict.item.compat}</h2></header>
          <div className="max-w-[780px]">
            {item.compatible.map((row, index) => (
              <div key={row.agent} className={`grid gap-2 py-3 text-[15px] md:grid-cols-[240px_1fr_100px] md:gap-6 ${index ? "border-t border-line" : ""}`}>
                <span className="font-medium">{row.agent}</span>
                <span className="text-mfg">{row.note}</span>
                <span className="num text-[12px] text-faint md:text-right">{row.via}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="px-4 pt-20">
        <header className="pb-6"><h2 className="pt">{item.type === "skill" ? dict.item.whenNot : dict.item.why}</h2></header>
        {item.type === "skill" ? <p className="max-w-[780px] text-[15px] leading-relaxed text-mfg">{item.whenNot}</p> : (
          <div className="max-w-[780px] space-y-5 text-[15px] leading-relaxed">
            <p><span className="font-medium">{dict.item.whyPick}</span><span className="text-mfg">　{item.whyPick}</span></p>
            <p><span className="font-medium">{dict.item.whenNot}</span><span className="text-mfg">　{item.whenNot}</span></p>
            {item.caveats ? <p><span className="font-medium">{dict.item.caveat}</span><span className="text-mfg">　{item.caveats}</span></p> : null}
          </div>
        )}
      </section>
      {item.agentSnippet ? (
        <section className="px-4 pt-20">
          <header className="pb-6"><h2 className="pt">{dict.item.snippet}</h2></header>
          <figure className="codefig max-w-[780px]">
            <div className="flex items-center gap-2 px-2.5 py-2 font-mono text-[13px] text-mfg">AGENTS.md <span className="tag">Prompt</span></div>
            <pre className="overflow-wrap-anywhere rounded-lg bg-bg p-4 font-mono text-[12.5px] leading-7 whitespace-pre-wrap shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--border)_64%,transparent)]">{item.agentSnippet}</pre>
          </figure>
        </section>
      ) : null}
      <section className="grid gap-10 px-4 pt-20 md:grid-cols-3">
        <div>
          <h3 className="text-[17px] font-medium">{item.type === "skill" ? dict.item.together : dict.item.peers}</h3>
          <div className="mt-3">
            {item.peers.map((peer, index) => (
              <Link key={peer.href} href={peer.href} className={`block py-3 ${index ? "border-t border-line" : ""}`}>
                <span className="flex items-center gap-2"><span className="font-medium link-u">{peer.name}</span><span className="tag">{peer.type}</span></span>
                <span className="mt-1 block text-[13.5px] text-mfg">{peer.oneLiner}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[17px] font-medium">{dict.item.appears}</h3>
          <div className="mt-3 space-y-2 text-[15px]">
            {item.builds.map((build) => <Link key={build.href} href={build.href} className="block link-u">{dict.nav.builds} · {build.title}</Link>)}
            {item.scenarios.map((scenario) => <Link key={scenario.href} href={scenario.href} className="block link-u">{dict.nav.scenarios} · {scenario.title}</Link>)}
            {item.categories.map((entry) => <Link key={entry.href} href={entry.href} className="block link-u">{entry.title}</Link>)}
            {item.related ? <Link href={item.related.href} className="block link-u">{dict.item.related} · {item.related.name}</Link> : null}
          </div>
        </div>
        <div>
          <h3 className="text-[17px] font-medium">{dict.item.source}</h3>
          <div className="num mt-3 space-y-2 text-[13px] text-mfg">
            {(item.sources ?? []).map((source) => <div key={source}>{source}</div>)}
            {item.homepage ? <a href={item.homepage} className="block link-u">{item.homepage.replace(/^https?:\/\//, "")}</a> : null}
            {item.repo ? <a href={item.repo} className="block link-u">{item.repo.replace(/^https?:\/\//, "")}</a> : null}
          </div>
        </div>
      </section>
    </Frame>
  );
}

function Code({ label, text }: { label: string; text: string }) {
  return (
    <figure className="codefig">
      <div className="px-2.5 py-2 font-mono text-[13px] text-mfg">{label}</div>
      <pre className="rounded-lg bg-bg p-4 font-mono text-[12.5px] leading-7 whitespace-pre-wrap shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--border)_64%,transparent)]">{text}</pre>
    </figure>
  );
}
