/**
 * [INPUT]: 依赖基准、变更与页面框架
 * [OUTPUT]: 对外提供基准页、变更页与 404
 * [POS]: src/views 的其余静态页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/frame";
import { RichText } from "@/components/rich-text";
import { getBenchmark, getChanges, listBenchmarks, slugs } from "@/lib/catalog";
import type { Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/site";

export function benchmarkParams() {
  return slugs("benchmarks").map((slug) => ({ slug }));
}

export function benchmarksMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/benchmarks", dict.benchmark.indexTitle, dict.benchmark.indexBody);
}

export async function benchmarkMetadata(locale: Locale, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const benchmark = getBenchmark(locale, slug);
  if (!benchmark) return {};
  return pageMetadata(locale, `/benchmarks/${slug}`, benchmark.name, benchmark.measures);
}

export function changesMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/changes", dict.changes.title, dict.changes.body);
}

export function BenchmarkIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.benchmark.indexTitle}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.benchmark.indexBody}</p>
      </section>
      <div className="mx-4 mt-10 border-t border-line">
        {listBenchmarks(locale).map((row) => (
          <Link key={row.href} href={row.href} className="rowh grid gap-2 border-b border-line py-4 md:grid-cols-[220px_120px_1fr]">
            <span className={`font-medium ${row.stale ? "text-faint" : ""}`}>{row.name}</span>
            <span className="num text-[12px] text-faint">{row.date} · {row.domain}</span>
            <span className="text-[14px] leading-relaxed text-mfg">{row.summary}</span>
          </Link>
        ))}
      </div>
    </Frame>
  );
}

export async function BenchmarkView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benchmark = getBenchmark(locale, slug);
  if (!benchmark) notFound();
  const dict = getDictionary(locale);
  const rows = [
    [dict.benchmark.measures, benchmark.measures],
    [dict.benchmark.method, benchmark.method],
    [dict.benchmark.meaning, benchmark.scoreMeaning],
    [dict.benchmark.caveats, benchmark.caveats],
    [dict.benchmark.cadence, benchmark.updateCadence],
  ];
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/benchmarks")} className="num hover:text-fg">{dict.nav.benchmarks}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{benchmark.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <h1 className="display-page">{benchmark.name}</h1>
        <p className="num mt-6 text-[12px] text-faint">{benchmark.asOf} · {benchmark.domain}</p>
        {benchmark.stale ? <p className="mt-4 text-[14px] text-mfg" data-stale="true">{dict.benchmark.stale}</p> : null}
      </section>
      <dl className="mx-4 mt-12 max-w-[820px]">
        {rows.map(([label, body], index) => (
          <div key={label} className={`grid gap-3 py-4 md:grid-cols-[120px_1fr] md:gap-6 ${index ? "border-t border-line" : ""}`}>
            <dt className="font-medium">{label}</dt>
            <dd className="leading-relaxed text-mfg">{body}</dd>
          </div>
        ))}
        <div className="grid gap-3 border-t border-line py-4 md:grid-cols-[120px_1fr] md:gap-6">
          <dt className="font-medium">{dict.benchmark.source}</dt>
          <dd className="space-y-1">{benchmark.links.map((link) => <a key={link.href} href={link.href} className="num block text-[13px] link-u">{link.label}</a>)}</dd>
        </div>
      </dl>
      {benchmark.scenarios.length ? (
        <section className="px-4 pt-16">
          <h2 className="pt">{dict.benchmark.usedBy}</h2>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">{benchmark.scenarios.map((scenario) => <Link key={scenario.href} href={scenario.href} className="link-u">{scenario.title}</Link>)}</div>
        </section>
      ) : null}
    </Frame>
  );
}

export function ChangesView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const rows = getChanges(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.changes.title}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">{dict.changes.body}</p>
      </section>
      <div className="mx-4 mt-10">
        {rows.map((change, index) => (
          <div key={`${change.date}-${index}`} className={`grid gap-1 py-3 sm:grid-cols-[64px_72px_1fr_120px] ${index < rows.length - 1 ? "border-b border-line" : ""}`}>
            <span className="num text-[12px] text-mfg">{change.date}</span>
            <span className="num text-[12px] text-faint">{change.kind}</span>
            <span className="leading-relaxed"><RichText text={change.text} /></span>
            <span className="num text-right text-[11px] text-faint">{change.source}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function NotFoundView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-24">
        <h1 className="display-page">{dict.notFound.title}</h1>
        <p className="mt-4 text-mfg">{dict.notFound.body}</p>
        <Link href={localePath(locale, "/")} className="mt-6 inline-block link-u">{dict.notFound.home}</Link>
      </section>
    </Frame>
  );
}
