/**
 * [INPUT]: 依赖 ModelEvaluation 的四条真实社区评价、正负关键短语、feed 展示元数据、Locale/Dictionary/localize、next/image 与 Phosphor 图标
 * [OUTPUT]: 对外提供紧凑三列 Community Reviews 原声流，按 blog / X / YouTube 渲染小圆角卡片并用绿红双色标注关键短语
 * [POS]: src/components 的社区原声展示区，位于 Community Verdict 之后、Footer 之前
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";
import { ArrowUpRight, XLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

import type { Dictionary, Locale, ModelEvaluation } from "@/lib/contracts";
import { localize } from "@/lib/model";

interface ReviewFeedProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

type Review = ModelEvaluation["reviews"][number];
type HighlightTone = keyof Review["feed"]["highlights"];

const highlightStyles = {
  positive: "bg-[var(--review-positive-soft)] text-[var(--review-positive)]",
  negative: "bg-[var(--review-negative-soft)] text-[var(--review-critical)]",
} as const;

const reviewOrder = ["Simon Willison", "AIReiter", "Peter", "Lentils"];

function Avatar({ review }: { review: Review }) {
  return (
    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-subtle font-mono text-[9px] font-semibold text-ink-soft">
      {review.feed.initials}
    </span>
  );
}

function localHighlights(review: Review, tone: HighlightTone, locale: Locale) {
  const highlights = review.feed.highlights[tone];
  return highlights[locale] ?? highlights.en;
}

function HighlightedExcerpt({ className, locale, review }: { className: string; locale: Locale; review: Review }) {
  const text = localize(review.summary, locale);
  const entries = (["positive", "negative"] as const).flatMap((tone) =>
    localHighlights(review, tone, locale).map((phrase) => ({ phrase, tone })),
  ).filter(({ phrase }) => text.includes(phrase));
  if (!entries.length) return <p className={className}>{text}</p>;

  const toneByPhrase = new Map(entries.map(({ phrase, tone }) => [phrase, tone]));
  const phrases = [...toneByPhrase.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

  return (
    <p className={className}>
      {text.split(pattern).map((part, index) => {
        const tone = toneByPhrase.get(part);
        return tone
          ? <mark className={`box-decoration-clone rounded-[1px] px-0.5 py-0.5 font-medium ${highlightStyles[tone]}`} data-tone={tone} key={`${part}-${index}`}>{part}</mark>
          : part;
      })}
    </p>
  );
}

function SourceLink({ label, review }: { label: string; review: Review }) {
  return (
    <a className="inline-flex items-center gap-1 rounded-sm font-mono text-[10px] text-accent-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" href={review.url} rel="noopener" target="_blank">
      {label}<ArrowUpRight aria-hidden="true" size={11} weight="bold" />
    </a>
  );
}

function ArticleCard({ className, dictionary, locale, review }: { className: string; dictionary: Dictionary; locale: Locale; review: Review }) {
  return (
    <article className={`break-inside-avoid rounded-[4px] border border-hairline border-t-[3px] border-t-[var(--review-critical)] bg-elevated p-4 shadow-[0_6px_20px_rgba(56,48,35,.035)] ${className}`}>
      <p className="font-mono text-[9px] font-medium uppercase tracking-[.15em] text-ink-faint">
        {review.feed.sourceLabel}{review.feed.readMinutes ? ` · ${review.feed.readMinutes} ${dictionary.feed.minRead}` : ""}
      </p>
      <HighlightedExcerpt className="mt-4 font-serif text-[14px] leading-[1.52] text-ink sm:text-[15px]" locale={locale} review={review} />
      <div className="mt-5 border-t border-hairline pt-4">
        <div className="flex items-center gap-3">
          <Avatar review={review} />
          <strong className="font-serif text-[14px] font-semibold leading-none text-ink">{review.feed.displayName}</strong>
        </div>
        <div className="mt-4"><SourceLink label={dictionary.feed.readArticle} review={review} /></div>
      </div>
    </article>
  );
}

function SocialCard({ className, locale, review }: { className: string; locale: Locale; review: Review }) {
  return (
    <article className={`break-inside-avoid rounded-[4px] border border-hairline bg-elevated p-4 shadow-[0_6px_20px_rgba(56,48,35,.04)] ${className}`}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--review-positive-soft)] font-mono text-[10px] font-semibold text-[var(--review-positive)]">{review.feed.initials}</span>
        <div className="min-w-0 flex-1">
          <strong className="block truncate font-sans text-[14px] font-semibold leading-tight text-ink">{review.feed.displayName}</strong>
          <span className="block truncate font-sans text-[10px] text-ink-faint">{review.feed.handle}</span>
        </div>
        <a aria-label={`Open ${review.feed.displayName} on X`} className="rounded-sm text-ink transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent" href={review.url} rel="noopener" target="_blank">
          <XLogo aria-hidden="true" size={18} weight="bold" />
        </a>
      </div>
      <HighlightedExcerpt className="mt-4 font-serif text-[14px] leading-[1.52] text-ink sm:text-[15px]" locale={locale} review={review} />
      <p className="mt-5 font-mono text-[9px] text-ink-faint">{review.date}</p>
    </article>
  );
}

function VideoCard({ className, dictionary, locale, review }: { className: string; dictionary: Dictionary; locale: Locale; review: Review }) {
  return (
    <article className={`break-inside-avoid overflow-hidden rounded-[4px] border border-hairline bg-elevated shadow-[0_6px_20px_rgba(56,48,35,.04)] ${className}`}>
      <a aria-label={`${dictionary.feed.watchVideo}: ${review.feed.displayName}`} className="group relative block aspect-[2.35/1] overflow-hidden bg-subtle" href={review.url} rel="noopener" target="_blank">
        <Image alt="" aria-hidden="true" className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]" fill sizes="(min-width: 768px) 33vw, 100vw" src={review.feed.thumbnail ?? ""} unoptimized />
        <span className="absolute inset-0 flex items-center justify-center">
          <YoutubeLogo aria-hidden="true" className="drop-shadow-sm" color="#D83A2E" size={48} weight="fill" />
        </span>
      </a>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar review={review} />
          <div className="min-w-0 flex-1">
            <strong className="block truncate font-serif text-[14px] font-semibold text-ink">{review.feed.displayName}</strong>
            <span className="block truncate font-mono text-[8px] uppercase tracking-[.1em] text-ink-faint">{review.feed.sourceLabel}</span>
          </div>
          <SourceLink label={dictionary.feed.watchVideo} review={review} />
        </div>
        <HighlightedExcerpt className="mt-4 font-serif text-[14px] leading-[1.52] text-ink sm:text-[15px]" locale={locale} review={review} />
      </div>
    </article>
  );
}

function ReviewCard({ className, dictionary, locale, review }: { className: string; dictionary: Dictionary; locale: Locale; review: Review }) {
  if (review.source === "x") return <SocialCard className={className} locale={locale} review={review} />;
  if (review.source === "youtube") return <VideoCard className={className} dictionary={dictionary} locale={locale} review={review} />;
  return <ArticleCard className={className} dictionary={dictionary} locale={locale} review={review} />;
}

export function ReviewFeed({ dictionary, evaluation, locale }: ReviewFeedProps) {
  const reviews = [...evaluation.reviews].sort(
    (left, right) => reviewOrder.indexOf(left.feed.displayName) - reviewOrder.indexOf(right.feed.displayName),
  );

  return (
    <section aria-labelledby="community-reviews-title" className="mt-8 scroll-mt-20" id="community-reviews">
      <h2 className="font-serif text-[25px] font-medium leading-none tracking-[-.015em] text-ink sm:text-[27px]" id="community-reviews-title">
        {dictionary.feed.headlineLead}{" "}<span className="italic text-ink-soft">{dictionary.feed.headlineQualifier}</span>
      </h2>
      <p className="mt-2 max-w-3xl font-serif text-[14px] leading-relaxed text-ink-soft sm:text-[15px]">
        {dictionary.feed.subtitle}{" · "}
        <mark className="bg-[var(--review-positive-soft)] px-1 text-[var(--review-positive)]">{dictionary.feed.positiveLabel}</mark>{" / "}
        <mark className="bg-[var(--review-negative-soft)] px-1 text-[var(--review-critical)]">{dictionary.feed.negativeLabel}</mark>
      </p>
      <div className="review-grid mt-4 grid gap-4 md:grid-cols-3 md:items-start">
        {reviews.map((review, index) => (
          <ReviewCard className={index === 3 ? "md:col-start-2" : ""} dictionary={dictionary} key={review.url} locale={locale} review={review} />
        ))}
      </div>
    </section>
  );
}
