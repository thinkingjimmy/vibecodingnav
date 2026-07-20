/**
 * [INPUT]: 依赖 next/image、ModelEvaluation 的厂商身份/性能指标、Locale、Dictionary 与 localize
 * [OUTPUT]: 对外提供 Models 页内导航目标、数据驱动的厂商标记 + 超大标题、可新页访问官网的厂商署名、发布/权重元信息、规格条与紧凑指标卡
 * [POS]: src/components 的详情页 Hero Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";
import type { Dictionary, Locale, ModelEvaluation } from "@/lib/contracts";
import { localize } from "@/lib/model";

interface HeroProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
  locale: Locale;
}

/* Newsreader 的 $ 是断笔画编辑字形，大字号下突兀；货币符号统一回落 Georgia 单笔画 */
function StatValue({ value }: { value: string }) {
  return value
    .split(/(\$|\/)/)
    .filter(Boolean)
    .map((part, index) =>
      part === "$"
        ? <span className="stat-currency" key={index}>$</span>
        : part === "/"
          ? <span className="stat-separator" key={index}>/</span>
          : <span key={index}>{part}</span>,
    );
}

export function Hero({ dictionary, evaluation, locale }: HeroProps) {
  const { model, performance } = evaluation;
  const specs = [
    [dictionary.hero.firstToken, performance.ttft],
    [dictionary.hero.verbosity, performance.verbosity],
    [dictionary.hero.parameters, `${model.params} ${model.architecture}`],
    [dictionary.hero.modality, model.modality],
  ] as const;

  return (
    <section className="scroll-mt-20 pb-12 pt-10" id="models">
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[.24em] text-accent-text">
          {model.kicker}
        </p>
        <dl className="grid shrink-0 grid-cols-[auto_auto] justify-items-end gap-x-3 gap-y-1 text-right font-mono text-[11px] [font-feature-settings:'tnum']">
          <dt className="text-right uppercase tracking-[.08em] text-ink-faint">{dictionary.hero.released}</dt>
          <dd className="font-medium text-ink">{model.released}</dd>
          <dt className="text-right uppercase tracking-[.08em] text-ink-faint">{dictionary.hero.weights}</dt>
          <dd className="font-medium text-ink">
            {/^\d{4}-/.test(model.openWeights)
              ? `${dictionary.hero.weightsDue} ${model.openWeights.slice(5)}`
              : model.openWeights}
          </dd>
        </dl>
      </div>
      <div className="hero-model-lockup mt-2 flex items-baseline gap-3 md:gap-4">
        <Image
          alt=""
          aria-hidden="true"
          className="size-11 shrink-0 md:size-14"
          height={56}
          src={model.vendorLogo ?? "/model-logos/moonshot.svg"}
          unoptimized
          width={56}
        />
        <h1 className="font-serif text-[52px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[72px] [text-wrap:balance]">
          {model.name}
        </h1>
      </div>
      <p className="mt-3 font-serif text-[19px] italic text-ink-soft">
        {dictionary.hero.by}{" "}
        <a
          className="rounded-sm transition-colors hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href={model.vendorUrl ?? "https://www.moonshot.ai/"}
          rel="noopener"
          target="_blank"
        >
          {model.vendor}
        </a>{" "}
        · {model.params} {model.architecture} · {model.license}
      </p>
      <div className="mt-6 flex flex-wrap gap-x-9 gap-y-2">
        {specs.map(([label, value]) => (
          <p className="font-mono text-[11px] [font-feature-settings:'tnum']" key={label}>
            <span className="uppercase tracking-[.1em] text-ink-faint">{label}</span>{" "}
            <span className="font-semibold text-ink">{value}</span>
          </p>
        ))}
      </div>
      <div className="hero-stats mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {evaluation.heroStats.map((stat) => (
          <div className="hero-stat-card flex min-h-[136px] flex-col rounded-lg border border-hairline bg-elevated px-4 pb-2.5 pt-4 shadow-[0_1px_2px_rgba(56,48,35,.04)]" key={stat.labelKey}>
            <div className="hero-stat-header flex min-h-[18px] items-start justify-between gap-2">
              <div className="whitespace-nowrap font-mono text-[10px] font-medium uppercase leading-[1.4] tracking-[.1em] text-ink-faint">
                {dictionary.stats[stat.labelKey]}
              </div>
              <span className={`stat-badge ${stat.tone === "neutral" ? "stat-badge-neutral" : ""}`}>{stat.badge}</span>
            </div>
            <div className="stat-value mt-3 flex items-baseline gap-1.5">
              <span><StatValue value={stat.value} /></span>
              {stat.unit ? <span className="stat-unit">{stat.unit}</span> : null}
            </div>
            <div aria-hidden="true" className="stat-bar mt-1.5">
              <i className={stat.tone === "neutral" ? "stat-bar-neutral" : ""} style={{ width: `${stat.bar}%` }} />
            </div>
            <div className="mt-2 truncate font-mono text-[10px] leading-[1.4] text-ink-faint [font-feature-settings:'tnum']" title={stat.sub ? localize(stat.sub, locale) : dictionary.stats[stat.subKey]}>
              {stat.sub ? localize(stat.sub, locale) : dictionary.stats[stat.subKey]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
