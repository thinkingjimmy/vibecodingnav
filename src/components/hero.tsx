/**
 * [INPUT]: 依赖 ModelEvaluation 与 Dictionary 的模型信息、性能指标和本地化文案
 * [OUTPUT]: 对外提供模型标题、元数据条与四张关键指标卡
 * [POS]: src/components 的详情页 Hero Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary, ModelEvaluation } from "@/lib/contracts";

interface HeroProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
}

export function Hero({ dictionary, evaluation }: HeroProps) {
  const { model, performance, pricing } = evaluation;

  return (
    <section className="pb-8 pt-10">
      <h1 className="font-serif text-[38px] font-medium leading-[1.15] tracking-[-0.02em] [text-wrap:balance]">
        {model.name}
      </h1>
      <p className="mt-1.5 font-serif text-[13px] italic text-ink-soft">
        {dictionary.hero.by} {model.vendor} · {model.params} {model.architecture} · {model.license}
      </p>
      <p className="mt-4 flex flex-wrap gap-x-7 gap-y-1.5 border-b border-accent pb-4 font-mono text-[11px] text-ink-faint [font-feature-settings:'tnum']">
        <span>{dictionary.hero.released} {model.released}</span>
        <span>{dictionary.hero.openWeights} {model.openWeights}</span>
        <span>{dictionary.hero.outputSpeed} {performance.outputSpeed}</span>
        <span>{dictionary.hero.ttft} {performance.ttft}</span>
        <span>{dictionary.hero.cached} ${pricing.cached.toFixed(2)}/M</span>
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {evaluation.heroStats.map((stat) => (
          <div className="rounded-lg border border-hairline bg-elevated p-4" key={stat.labelKey}>
            <div className="font-mono text-[10px] font-medium uppercase tracking-[.1em] text-ink-faint">
              {dictionary.stats[stat.labelKey]}
            </div>
            <div className="stat-value mt-2">{stat.value}</div>
            <div className="mt-2 font-mono text-[10px] text-ink-faint [font-feature-settings:'tnum']">
              {dictionary.stats[stat.subKey]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
