/**
 * [INPUT]: 依赖 ModelEvaluation 的社区结论、情绪分布与精简共识，依赖 Locale、Dictionary、localize 与 Phosphor 图标
 * [OUTPUT]: 对外提供编辑式 Community Verdict：结论标题、紧凑评分分布与带行分隔的赢点/短板双栏
 * [POS]: src/components 的 Reviews Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Circle, Minus, Plus, Triangle } from "@phosphor-icons/react/dist/ssr";

import type { Dictionary, Locale, LocalizedText, ModelEvaluation } from "@/lib/contracts";
import { localize } from "@/lib/model";

interface ReviewsProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

const listStyles = {
  pro: { Icon: Plus, heading: "text-[var(--review-positive)]", icon: "text-[var(--review-positive)]" },
  con: { Icon: Minus, heading: "text-[var(--review-critical)]", icon: "text-[var(--review-critical)]" },
} as const;

function VerdictList({ heading, items, locale, tone }: {
  heading: string;
  items: LocalizedText[];
  locale: Locale;
  tone: keyof typeof listStyles;
}) {
  const { Icon, heading: headingClass, icon } = listStyles[tone];
  return (
    <div>
      <h3 className={`font-mono text-[10px] font-medium uppercase tracking-[.16em] ${headingClass}`}>{heading}</h3>
      <ul className="mt-3">
        {items.map((item) => (
          <li className="flex items-center gap-3 border-b border-hairline py-3 first:pt-0" key={item.en}>
            <Icon aria-hidden="true" className={`shrink-0 ${icon}`} size={14} weight="regular" />
            <span className="font-serif text-[15px] leading-[1.3] text-ink sm:text-[16px]">{localize(item, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SegmentIcon({ index }: { index: number }) {
  if (index === 0) return <Triangle aria-hidden="true" size={8} weight="fill" />;
  if (index === 1) return <Circle aria-hidden="true" size={8} weight="fill" />;
  return <Triangle aria-hidden="true" className="rotate-180" size={8} weight="fill" />;
}

function VerdictScore({ dictionary, verdict }: {
  dictionary: Dictionary;
  verdict: ModelEvaluation["verdict"];
}) {
  const segments = [
    { count: verdict.distribution.rave, label: dictionary.reviews.rave, color: "var(--review-positive)" },
    { count: verdict.distribution.mixed, label: dictionary.reviews.mixed, color: "var(--review-mixed)" },
    { count: verdict.distribution.critical, label: dictionary.reviews.critical, color: "var(--review-critical)" },
  ];
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <div className="verdict-score mt-5 grid gap-5 rounded-[6px] border border-hairline bg-elevated p-5 sm:min-h-[112px] sm:grid-cols-[120px_1fr] sm:items-center">
      <div className="verdict-score-summary text-center sm:translate-y-[2px] sm:border-r sm:border-hairline sm:pr-5">
        <div className="font-serif text-[48px] font-medium leading-[.82] tracking-[-.04em] text-ink sm:text-[52px]">{verdict.score}</div>
        <div className="mt-3 font-mono text-[10px] font-medium uppercase tracking-[.08em] text-ink-faint">
          / 5 · {total} {dictionary.reviews.takes}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <div
          aria-label={`${verdict.score} / 5 · ${segments.map((segment) => `${segment.count} ${segment.label}`).join(", ")}`}
          className="flex h-[10px] overflow-hidden rounded-full"
          role="img"
        >
          {segments.map((segment) => (
            <span
              className="h-full"
              key={segment.label}
              style={{ backgroundColor: segment.color, width: `${(segment.count / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] text-ink-faint sm:text-[11px]">
          {segments.map((segment, index) => (
            <div className="flex items-center justify-center gap-2 first:justify-start last:justify-end" key={segment.label} style={{ color: segment.color }}>
              <SegmentIcon index={index} />
              <span><strong className="font-medium">{segment.count}</strong>{" "}{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Reviews({ dictionary, evaluation, locale }: ReviewsProps) {
  const { verdict } = evaluation;
  return (
    <section aria-labelledby="community-verdict-title" className="mt-14" id="community-verdict">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[.2em] text-accent-text">{dictionary.reviews.title}</p>
      <h2 className="mt-2 font-serif text-[30px] font-medium leading-none tracking-[-.02em] text-ink" id="community-verdict-title">
        {localize(verdict.headline.lead, locale)}{" "}
        <span className="italic text-ink-soft">{localize(verdict.headline.qualifier, locale)}</span>
      </h2>
      <VerdictScore dictionary={dictionary} verdict={verdict} />
      <div className="mt-7 grid gap-7 md:grid-cols-2 md:gap-10">
        <VerdictList heading={dictionary.reviews.consensusPros} items={verdict.pros} locale={locale} tone="pro" />
        <VerdictList heading={dictionary.reviews.consensusCons} items={verdict.cons} locale={locale} tone="con" />
      </div>
    </section>
  );
}
