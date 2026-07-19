/**
 * [INPUT]: 依赖 next/image、public/moonshot.svg、ModelEvaluation 与 Dictionary 的模型信息、性能指标和本地化文案
 * [OUTPUT]: 对外提供 Models 页内导航目标、与标题基线对齐的 Moonshot 标记 + 超大标题、眉标行、规格条与两列到四列自适应指标卡
 * [POS]: src/components 的详情页 Hero Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Image from "next/image";
import type { Dictionary, ModelEvaluation } from "@/lib/contracts";

interface HeroProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
}

/* Newsreader 的 $ 是断笔画编辑字形，大字号下突兀；货币符号统一回落 Georgia 单笔画 */
function StatValue({ value }: { value: string }) {
  return value
    .split(/(\$)/)
    .filter(Boolean)
    .map((part, index) =>
      part === "$" ? <span className="stat-currency" key={index}>$</span> : <span key={index}>{part}</span>,
    );
}

export function Hero({ dictionary, evaluation }: HeroProps) {
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
        <dl className="grid shrink-0 grid-cols-[auto_auto] gap-x-3 gap-y-1 font-mono text-[11px] [font-feature-settings:'tnum']">
          <dt className="text-right uppercase tracking-[.08em] text-ink-faint">{dictionary.hero.released}</dt>
          <dd className="font-medium text-ink">{model.released}</dd>
          <dt className="text-right uppercase tracking-[.08em] text-ink-faint">{dictionary.hero.weights}</dt>
          <dd className="font-medium text-ink">{dictionary.hero.weightsDue} {model.openWeights.slice(5)}</dd>
        </dl>
      </div>
      <div className="hero-model-lockup mt-2 flex items-baseline gap-3 md:gap-4">
        <Image
          alt=""
          aria-hidden="true"
          className="size-11 shrink-0 md:size-14"
          height={56}
          src="/moonshot.svg"
          unoptimized
          width={56}
        />
        <h1 className="font-serif text-[52px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[72px] [text-wrap:balance]">
          {model.name}
        </h1>
      </div>
      <p className="mt-3 font-serif text-[19px] italic text-ink-soft">
        {dictionary.hero.by} {model.vendor} · {model.params} {model.architecture} · {model.license}
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
          <div className="border border-hairline p-5" key={stat.labelKey}>
            <div className="hero-stat-header flex min-h-[34px] items-start justify-between gap-2">
              <div className="font-mono text-[10px] font-medium uppercase leading-[1.7] tracking-[.1em] text-ink-faint">
                {dictionary.stats[stat.labelKey]}
              </div>
              <span className="stat-badge">{stat.badge}</span>
            </div>
            <div className="stat-value mt-5"><StatValue value={stat.value} /></div>
            <div aria-hidden="true" className="stat-bar mt-6">
              <i style={{ width: `${stat.bar}%` }} />
            </div>
            <div className="mt-3 font-mono text-[10px] leading-[1.7] text-ink-faint [font-feature-settings:'tnum']">
              {dictionary.stats[stat.subKey]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
