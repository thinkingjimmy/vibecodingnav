/**
 * [INPUT]: 依赖 ModelEvaluation 的社区结论、情绪分布、精简共识与原始评价来源，依赖 Locale、Dictionary、localize 与 Phosphor 图标
 * [OUTPUT]: 对外提供编辑式 Community Verdict：结论标题、评分分布、赢点/短板双栏与紧凑来源回链
 * [POS]: src/components 的 Reviews Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";

import type { Dictionary, Locale, LocalizedText, ModelEvaluation } from "@/lib/contracts";
import { localize } from "@/lib/model";

interface ReviewsProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

const listStyles = {
  pro: { Icon: Plus, heading: "text-accent-text", icon: "bg-accent-soft text-accent-text" },
  con: { Icon: Minus, heading: "text-[var(--review-critical)]", icon: "bg-[var(--review-negative-soft)] text-[var(--review-critical)]" },
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
      <h3 className={`font-mono text-[11px] font-medium uppercase tracking-[.16em] ${headingClass}`}>{heading}</h3>
      <ul className="mt-5 space-y-4 sm:space-y-5">
        {items.map((item) => (
          <li className="flex items-start gap-3" key={item.en}>
            <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${icon}`}>
              <Icon aria-hidden="true" size={14} weight="bold" />
            </span>
            <span className="font-serif text-[18px] leading-[1.25] text-ink sm:text-[21px]">{localize(item, locale)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VerdictScore({ dictionary, verdict }: {
  dictionary: Dictionary;
  verdict: ModelEvaluation["verdict"];
}) {
  const segments = [
    { count: verdict.distribution.rave, label: dictionary.reviews.rave, color: "var(--accent)" },
    { count: verdict.distribution.mixed, label: dictionary.reviews.mixed, color: "var(--review-mixed)" },
    { count: verdict.distribution.critical, label: dictionary.reviews.critical, color: "var(--review-critical)" },
  ];
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <div className="mt-9 grid gap-6 rounded-xl border border-hairline bg-elevated/40 p-5 sm:min-h-[166px] sm:grid-cols-[200px_1fr] sm:p-7">
      <div className="text-center sm:border-r sm:border-hairline sm:pr-7">
        <div className="font-serif text-[72px] font-medium leading-[.85] tracking-[-.04em] text-ink sm:text-[80px]">{verdict.score}</div>
        <div className="mt-4 font-mono text-[11px] font-medium uppercase tracking-[.1em] text-ink-faint">
          / 5 · {total} {dictionary.reviews.takes}
        </div>
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <div
          aria-label={`${verdict.score} / 5 · ${segments.map((segment) => `${segment.count} ${segment.label}`).join(", ")}`}
          className="flex h-4 overflow-hidden rounded-full sm:h-5"
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
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-soft sm:text-[12px]">
          {segments.map((segment) => (
            <div className="text-center first:text-left last:text-right" key={segment.label}>
              <strong style={{ color: segment.color }}>{segment.count}</strong>{" "}{segment.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewSources({ dictionary, reviews }: {
  dictionary: Dictionary;
  reviews: ModelEvaluation["reviews"];
}) {
  return (
    <nav aria-label={dictionary.reviews.sources} className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-4 font-mono text-[10px] text-ink-faint">
      <span className="font-medium uppercase tracking-[.12em]">{dictionary.reviews.sources}</span>
      {reviews.map((review) => (
        <a className="transition-colors hover:text-ink" href={review.url} key={review.url} rel="noopener" target="_blank">
          {review.author} ↗
        </a>
      ))}
    </nav>
  );
}

export function Reviews({ dictionary, evaluation, locale }: ReviewsProps) {
  const { verdict } = evaluation;
  return (
    <section aria-labelledby="community-verdict-title" className="mt-14" id="community-verdict">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[.2em] text-accent-text">{dictionary.reviews.title}</p>
      <h2 className="mt-1 font-serif text-[30px] font-medium leading-none tracking-[-.02em] text-ink sm:text-[36px]" id="community-verdict-title">
        {localize(verdict.headline.lead, locale)}{" "}
        <span className="italic">{localize(verdict.headline.qualifier, locale)}</span>
      </h2>
      <VerdictScore dictionary={dictionary} verdict={verdict} />
      <div className="mt-10 grid gap-9 md:grid-cols-2 md:gap-12">
        <VerdictList heading={dictionary.reviews.consensusPros} items={verdict.pros} locale={locale} tone="pro" />
        <VerdictList heading={dictionary.reviews.consensusCons} items={verdict.cons} locale={locale} tone="con" />
      </div>
      <ReviewSources dictionary={dictionary} reviews={evaluation.reviews} />
    </section>
  );
}
