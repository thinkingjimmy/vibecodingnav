/**
 * [INPUT]: 依赖 next/image、共享品牌资产、当前 Locale、ModelEvaluation 的首要数据源与 Dictionary 页脚文案
 * [OUTPUT]: 对外提供与正文同版心的编辑式 Footer：品牌说明、真实页内导航、数据来源、更新时间与版权信息
 * [POS]: src/components 的详情页 Footer Server Component，以共享字体与宽度 token 收束页面信息层级
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
    <div className="max-w-[360px] lg:max-w-[390px]">
      <hr className="mb-6 w-12 border-0 border-t-[3px] border-accent" />
      <a aria-label="AIEvalIndex" className="group inline-flex items-center gap-2.5" href={localePath(locale)}>
        <Image alt="" aria-hidden="true" className="size-8 shrink-0" height={32} src={SITE_ICON.url} unoptimized width={32} />
        <span className="translate-y-px whitespace-nowrap font-serif text-[27px] leading-none tracking-[-.03em] text-ink">
          <span className="font-semibold">AI Eval</span>{" "}
          <span className="font-normal italic transition-colors group-hover:text-ink-soft">Index</span>
        </span>
      </a>
      <p className="mt-5 font-serif text-[16px] leading-[1.55] text-ink-soft sm:text-[17px]">{description}</p>
    </div>
  );
}

function FooterLinkGroup({ label, links }: { label: string; links: FooterLink[] }) {
  return (
    <nav aria-label={label}>
      <h2 className="font-mono text-[10px] font-medium uppercase tracking-[.18em] text-ink-faint">{label}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <a className="rounded-sm font-serif text-[16px] leading-snug text-accent-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-[17px]" href={link.href}>
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
    <div className="footer-meta mx-auto grid max-w-5xl gap-2 px-5 py-5 font-mono text-[10px] leading-relaxed tracking-[.03em] text-ink-faint sm:text-[11px] md:grid-cols-[1fr_auto] md:items-center">
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
    { href: "#community-reviews", label: dictionary.footer.reviews },
  ];
  const aboutLinks = [
    { href: "#methodology", label: dictionary.footer.methodology },
    { href: "#data-sources", label: dictionary.footer.dataSources },
  ];

  return (
    <footer className="mt-16 scroll-mt-20 border-t border-hairline bg-subtle" id="methodology">
      <div className="footer-primary mx-auto max-w-5xl px-5 py-10 sm:py-12">
        <div className="footer-primary-grid grid gap-9 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.72fr)_minmax(0,.72fr)] lg:gap-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandIntro description={dictionary.footer.description} locale={locale} />
          </div>
          <FooterLinkGroup label={dictionary.footer.explore} links={exploreLinks} />
          <FooterLinkGroup label={dictionary.footer.about} links={aboutLinks} />
        </div>
      </div>
      <div className="border-t border-hairline"><FooterMeta dictionary={dictionary} evaluation={evaluation} /></div>
    </footer>
  );
}
