/**
 * [INPUT]: 依赖 next/image、共享品牌资产、当前 Locale、ModelEvaluation 的首要数据源与 Dictionary 页脚文案
 * [OUTPUT]: 对外提供全宽编辑式 Footer：品牌说明、真实页内导航、数据来源、更新时间与版权信息
 * [POS]: src/components 的详情页 Footer Server Component，承接页面尾部的品牌表达与导航收束
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";

import type { Dictionary, Locale, ModelEvaluation } from "@/lib/contracts";
import { localePath, SITE_ICON } from "@/lib/site";

interface FooterProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

interface FooterLink {
  href: string;
  label: string;
}

function BrandIntro({ description, locale }: { description: string; locale: Locale }) {
  return (
    <div className="max-w-[520px]">
      <a aria-label="AIEvalIndex" className="group inline-flex items-center gap-3" href={localePath(locale)}>
        <Image alt="" aria-hidden="true" className="size-9 shrink-0 lg:size-10" height={40} src={SITE_ICON.url} unoptimized width={40} />
        <span className="translate-y-px whitespace-nowrap font-serif text-[30px] leading-none tracking-[-.035em] text-ink lg:text-[36px]">
          <span className="font-semibold">AI Eval</span>{" "}
          <span className="font-normal italic transition-colors group-hover:text-ink-soft">Index</span>
        </span>
      </a>
      <p className="mt-7 max-w-[500px] font-serif text-[20px] leading-[1.55] text-ink-soft sm:text-[22px] lg:text-[26px]">{description}</p>
    </div>
  );
}

function FooterLinkGroup({ label, links }: { label: string; links: FooterLink[] }) {
  return (
    <nav aria-label={label}>
      <h2 className="font-mono text-[11px] font-medium uppercase tracking-[.16em] text-ink-faint lg:text-[14px]">{label}</h2>
      <ul className="mt-5 space-y-3.5 lg:mt-6 lg:space-y-4">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <a className="rounded-sm font-mono text-[15px] text-ink-soft transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:text-[22px]" href={link.href}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterMeta({ dictionary, evaluation }: Pick<FooterProps, "dictionary" | "evaluation">) {
  const source = evaluation.sources[0];
  const sourceName = source.name.split(" — ")[0];
  return (
    <div className="mt-14 grid gap-5 border-t border-hairline pt-7 font-mono text-[11px] leading-relaxed text-ink-faint sm:text-[12px] md:grid-cols-[1fr_auto] md:items-center lg:pt-8 lg:text-[15px]">
      <p id="data-sources">
        {dictionary.footer.modelDataFrom}{" "}
        <a className="text-accent-text transition-colors hover:text-accent" href={source.url} rel="noopener" target="_blank">{sourceName}</a>
        {" · "}{dictionary.footer.updated} {evaluation.updated}
      </p>
      <p className="md:text-right">© 2026 AI Eval Index</p>
    </div>
  );
}

export function Footer({ dictionary, evaluation, locale }: FooterProps) {
  const exploreLinks = [
    { href: "#models", label: dictionary.footer.models },
    { href: "#leaderboard", label: dictionary.footer.leaderboards },
    { href: "#leaderboard", label: dictionary.footer.benchmarks },
    { href: "#community-verdict", label: dictionary.footer.reviews },
  ];
  const aboutLinks = [
    { href: "#methodology", label: dictionary.footer.methodology },
    { href: "#data-sources", label: dictionary.footer.dataSources },
  ];

  return (
    <footer className="mt-16 scroll-mt-20 border-t border-hairline bg-subtle" id="methodology">
      <div className="mx-auto max-w-[1536px] px-5 py-14 sm:px-10 sm:py-16 lg:px-12 lg:pb-14 lg:pt-20">
        <div className="h-[3px] w-24 bg-accent" />
        <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-20">
          <BrandIntro description={dictionary.footer.description} locale={locale} />
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <FooterLinkGroup label={dictionary.footer.explore} links={exploreLinks} />
            <FooterLinkGroup label={dictionary.footer.about} links={aboutLinks} />
          </div>
        </div>
        <FooterMeta dictionary={dictionary} evaluation={evaluation} />
      </div>
    </footer>
  );
}
