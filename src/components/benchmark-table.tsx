/**
 * [INPUT]: 依赖 ModelEvaluation 的锚点（全名 + 短标签）、跑分、注释与来源数据，依赖 Phosphor 图标与 ui/tooltip
 * [OUTPUT]: 对外提供 Leaderboard 页内导航目标与去卡片化跑分对照表：蓝色眉标、衬线比较标题、等宽规则说明、吸顶常显分隔线、放大的 Kimi 表头与蓝色数据带、
 *           吸顶表头、最佳成绩加粗、胜出项统计、行悬停浮现的图标与 shadcn Tooltip 注释提示
 * [POS]: src/components 的 Benchmarks Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ArrowSquareOut, Info } from "@phosphor-icons/react/dist/ssr";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Dictionary, ModelEvaluation } from "@/lib/contracts";

interface BenchmarkTableProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
}

function numericScore(value: string | undefined) {
  if (!value) return Number.NEGATIVE_INFINITY;
  const score = Number.parseFloat(value.replaceAll(",", ""));
  return Number.isNaN(score) ? Number.NEGATIVE_INFINITY : score;
}

export function BenchmarkTable({ dictionary, evaluation }: BenchmarkTableProps) {
  const rows = evaluation.benchmarks.map((benchmark) => {
    const scores = [
      numericScore(benchmark.score),
      ...evaluation.anchors.map((anchor) => numericScore(benchmark.peers[anchor.name])),
    ];
    return { benchmark, bestScore: Math.max(...scores), scores };
  });
  const wins = rows.reduce(
    (counts, row) => counts.map((count, index) => count + Number(row.scores[index] === row.bestScore)),
    Array(evaluation.anchors.length + 1).fill(0) as number[],
  );

  return (
    <section className="scroll-mt-20" id="leaderboard">
      <div className="mb-2">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[.2em] text-accent-text">
          {dictionary.bench.title}
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <h2 className="font-serif text-[30px] font-medium leading-none tracking-[-.02em] text-ink sm:text-[36px]">
            {evaluation.model.name} {dictionary.bench.versus}{" "}
            <span className="italic">{dictionary.bench.anchors}</span>
          </h2>
          <p className="pb-1 font-mono text-[9px] font-medium uppercase tracking-[.12em] text-ink-faint sm:text-[10px]">
            {dictionary.bench.subtitle}
          </p>
        </div>
      </div>
      <div className="benchmark-scroll overflow-x-auto min-[680px]:overflow-visible">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="benchmark-head sticky top-[49px] z-40 bg-bg sm:top-[57px]">
            <tr className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-faint">
              <th className="py-3 pr-4 font-medium">{dictionary.bench.benchmark}</th>
              <th className="benchmark-model-header px-3 py-3 text-right text-[12px] font-bold tracking-[.12em] text-accent-text sm:text-[13px]">
                {evaluation.model.name}
              </th>
              {evaluation.anchors.map((anchor) => (
                <th className="px-3 py-3 text-right font-medium last:pr-0" key={anchor.name}>
                  {anchor.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ benchmark, bestScore, scores }) => {
              const meta = [benchmark.detail, benchmark.note].filter(Boolean).join(" · ");
              return (
                <tr className="border-t border-hairline" key={benchmark.name}>
                  <td className="py-3 pr-4 align-middle">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-1 text-ink-faint">
                        <div className="font-serif text-[17px] leading-[1.25] text-ink">{benchmark.name}</div>
                        {meta && (
                          <Tooltip>
                            <TooltipTrigger
                              aria-label={`Benchmark note: ${meta}`}
                              className="benchmark-icon shrink-0"
                            >
                              <Info aria-hidden="true" size={14} weight="bold" />
                            </TooltipTrigger>
                            <TooltipContent>{meta}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <a
                        aria-label={`Open source: ${benchmark.sourceLabel}`}
                        className="benchmark-icon shrink-0"
                        href={benchmark.url}
                        rel="noopener"
                        target="_blank"
                        title={benchmark.sourceLabel}
                      >
                        <ArrowSquareOut aria-hidden="true" size={14} weight="bold" />
                      </a>
                    </div>
                  </td>
                  <td
                    className={`k3-cell${scores[0] === bestScore ? " best-score" : ""}`}
                    data-best={scores[0] === bestScore || undefined}
                  >
                    {benchmark.score}
                  </td>
                  {evaluation.anchors.map((anchor, index) => (
                    <td
                      className={`bench-num last:pr-0${scores[index + 1] === bestScore ? " best-score" : ""}`}
                      data-best={scores[index + 1] === bestScore || undefined}
                      key={anchor.name}
                    >
                      {benchmark.peers[anchor.name] ?? "—"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-hairline">
              <th
                className="py-3 pr-4 font-mono text-[10px] font-medium uppercase tracking-[.1em] text-ink-faint"
                scope="row"
              >
                {dictionary.bench.wins}
              </th>
              <td className="k3-cell font-bold">{wins[0]}</td>
              {evaluation.anchors.map((anchor, index) => (
                <td className="bench-num text-ink last:pr-0" key={anchor.name}>{wins[index + 1]}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
