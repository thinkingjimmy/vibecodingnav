/**
 * [INPUT]: 依赖 ModelEvaluation 的锚点与跑分数据、Dictionary 的表头文案
 * [OUTPUT]: 对外提供可横向滚动、来源可回溯的跑分对照表
 * [POS]: src/components 的 Benchmarks Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary, ModelEvaluation } from "@/lib/contracts";

interface BenchmarkTableProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
}

export function BenchmarkTable({ dictionary, evaluation }: BenchmarkTableProps) {
  return (
    <section>
      <h2 className="section-label">{dictionary.bench.title}</h2>
      <p className="mb-4 font-serif text-[13.5px] leading-[1.6] text-ink-soft">{dictionary.bench.subtitle}</p>
      <div className="benchmark-scroll overflow-x-auto rounded-lg border border-hairline bg-elevated">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-faint">
              <th className="px-4 py-3 font-medium">{dictionary.bench.benchmark}</th>
              <th className="k3-head px-3 py-3 text-right font-semibold">{evaluation.model.name}</th>
              {evaluation.anchors.map((anchor) => (
                <th className="px-3 py-3 text-right font-medium" key={anchor}>{anchor}</th>
              ))}
              <th className="px-4 py-3 text-right font-medium">{dictionary.bench.source}</th>
            </tr>
          </thead>
          <tbody>
            {evaluation.benchmarks.map((benchmark) => {
              const meta = [benchmark.detail, benchmark.note].filter(Boolean).join(" · ");
              return (
                <tr className="border-t border-hairline" key={benchmark.name}>
                  <td className="px-4 py-2.5 align-top">
                    <div className="font-serif text-[15px] font-medium leading-[1.2]">{benchmark.name}</div>
                    {meta && <div className="mt-0.5 font-mono text-[10px] text-ink-faint [font-feature-settings:'tnum']">{meta}</div>}
                  </td>
                  <td className="k3-cell">{benchmark.score}</td>
                  {evaluation.anchors.map((anchor) => (
                    <td className="bench-num" key={anchor}>{benchmark.peers[anchor] ?? "—"}</td>
                  ))}
                  <td className="px-4 py-2.5 text-right align-top">
                    <a className="tag-chip whitespace-nowrap" href={benchmark.url} rel="noopener" target="_blank">
                      {benchmark.sourceLabel} ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
