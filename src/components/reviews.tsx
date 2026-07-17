/**
 * [INPUT]: 依赖 ModelEvaluation 的评价/共识、Locale、Dictionary 与 localize 英文兜底
 * [OUTPUT]: 对外提供优缺点共识双栏和社区评价卡片网格
 * [POS]: src/components 的 Reviews Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary, Locale, LocalizedText, ModelEvaluation } from "@/lib/contracts";
import { localize } from "@/lib/model";

interface ReviewsProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

const initials = (author: string) =>
  author.split(/[\s(@—]+/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");

function ConsensusList({ items, locale }: { items: LocalizedText[]; locale: Locale }) {
  return (
    <ul className="consensus-list">
      {items.map((item) => <li key={item.en}>{localize(item, locale)}</li>)}
    </ul>
  );
}

export function Reviews({ dictionary, evaluation, locale }: ReviewsProps) {
  return (
    <section className="mt-12">
      <h2 className="section-label">{dictionary.reviews.title}</h2>
      <p className="mb-4 font-serif text-[13.5px] leading-[1.6] text-ink-soft">{dictionary.reviews.subtitle}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="tldr-box">
          <h3 className="mb-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-accent-text">{dictionary.reviews.consensusPros}</h3>
          <ConsensusList items={evaluation.consensus.pros} locale={locale} />
        </div>
        <div className="tldr-box tldr-warn">
          <h3 className="mb-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-warn">{dictionary.reviews.consensusCons}</h3>
          <ConsensusList items={evaluation.consensus.cons} locale={locale} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {evaluation.reviews.map((review) => (
          <article className="flex flex-col rounded-lg border border-hairline bg-elevated p-5" key={review.url}>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-subtle font-mono text-[11px] font-semibold text-ink-soft">{initials(review.author)}</span>
              <div className="min-w-0">
                <div className="truncate font-serif text-[15px] font-medium">{review.author}</div>
                <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-ink-faint">
                  <span className="banner-tag uppercase">{review.source}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 grow font-serif text-[13.5px] leading-[1.6] text-ink-soft">{localize(review.summary, locale)}</p>
            <p className="mt-4">
              <a className="btn" href={review.url} rel="noopener" target="_blank">{dictionary.reviews.readOriginal} ↗</a>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
