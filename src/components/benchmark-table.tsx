"use client";

/**
 * [INPUT]: 依赖 ModelEvaluation 的锚点（全名 + 短标签）、跑分、注释与来源数据，依赖 React 状态、Phosphor 图标与 ui/tooltip
 * [OUTPUT]: 对外提供可筛选比较模型的 Leaderboard：Compare 胶囊、来源虚线链接、动态最佳成绩/胜出项、Kimi 蓝色数据带与保留分隔线的吸顶表头
 * [POS]: src/components 的 Benchmarks Client Component，在页面内独立管理比较列可见状态
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { useState } from "react";
import { Check, Info } from "@phosphor-icons/react";

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
  const [subtitleLead, subtitleEmphasis] = dictionary.bench.subtitle.split(" · ", 2);
  const [selectedAnchors, setSelectedAnchors] = useState(() =>
    evaluation.anchors.map((anchor) => anchor.name),
  );
  const visibleAnchors = evaluation.anchors.filter((anchor) => selectedAnchors.includes(anchor.name));
  const rows = evaluation.benchmarks.map((benchmark) => {
    const scores = [
      numericScore(benchmark.score),
      ...visibleAnchors.map((anchor) => numericScore(benchmark.peers[anchor.name])),
    ];
    return { benchmark, bestScore: Math.max(...scores), scores };
  });
  const wins = rows.reduce(
    (counts, row) => counts.map((count, index) => count + Number(row.scores[index] === row.bestScore)),
    Array(visibleAnchors.length + 1).fill(0) as number[],
  );
  const tableMinWidth = Math.max(560, 330 + (visibleAnchors.length + 1) * 150);

  function toggleAnchor(name: string) {
    setSelectedAnchors((current) =>
      current.includes(name) ? current.filter((anchor) => anchor !== name) : [...current, name],
    );
  }

  return (
    <section className="scroll-mt-20" id="leaderboard">
      <div className="mb-5">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[.2em] text-accent-text">
          {dictionary.bench.title}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-2">
          <h2
            className="font-serif text-[30px] font-medium leading-none tracking-[-.02em] text-ink sm:text-[36px]"
            id="benchmark-title"
          >
            {evaluation.model.name} {dictionary.bench.versus}{" "}
            <span className="italic text-ink-soft">{dictionary.bench.anchors}</span>
          </h2>
          <p className="pb-1 font-mono text-[9px] font-medium uppercase tracking-[.12em] text-ink-faint sm:text-[10px]">
            {subtitleLead}
            {subtitleEmphasis ? <> · <strong className="font-bold text-ink-soft">{subtitleEmphasis}</strong></> : null}
          </p>
        </div>
      </div>

      <div
        aria-label={dictionary.bench.compare}
        className="mb-3 flex flex-wrap items-center gap-2"
        role="group"
      >
        <span className="mr-1 font-mono text-[10px] font-medium uppercase tracking-[.12em] text-ink-faint">
          {dictionary.bench.compare}
        </span>
        {evaluation.anchors.map((anchor) => {
          const selected = selectedAnchors.includes(anchor.name);
          return (
            <button
              aria-controls="benchmark-table"
              aria-pressed={selected}
              className={`inline-flex min-h-7 items-center gap-1 rounded-full border px-2.5 font-mono text-[10px] font-medium tracking-[.04em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                selected
                  ? "border-accent bg-accent-soft/55 text-accent-text hover:bg-accent-soft"
                  : "border-hairline-strong bg-transparent text-ink-faint hover:border-accent hover:text-accent-text"
              }`}
              key={anchor.name}
              onClick={() => toggleAnchor(anchor.name)}
              type="button"
            >
              {anchor.label}
              {selected && <Check aria-hidden="true" size={13} weight="bold" />}
            </button>
          );
        })}
      </div>

      <div className="benchmark-scroll overflow-x-auto min-[680px]:overflow-visible">
        <table
          aria-labelledby="benchmark-title"
          className="w-full table-fixed border-collapse text-left"
          id="benchmark-table"
          style={{ minWidth: tableMinWidth }}
        >
          <colgroup>
            <col className="w-[34%]" />
            <col />
            {visibleAnchors.map((anchor) => <col key={anchor.name} />)}
          </colgroup>
          <thead className="benchmark-head sticky top-0 z-40 bg-bg min-[680px]:top-[57px]">
            <tr className="font-mono text-[10px] uppercase tracking-[.1em] text-ink-faint">
              <th className="py-2 pr-4 font-medium">{dictionary.bench.benchmark}</th>
              <th className="benchmark-model-header px-3 py-2 text-right text-[12px] font-bold tracking-[.12em] text-accent-text sm:text-[13px]">
                {evaluation.model.name}
              </th>
              {visibleAnchors.map((anchor) => (
                <th className="px-3 py-2 text-right font-medium last:pr-0" key={anchor.name}>
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
                  <td className="py-[7px] pr-4 align-middle">
                    <div className="flex items-center gap-1.5 text-ink-faint">
                      <a
                        className="benchmark-name relative -top-0.5 min-w-0 border-b border-dashed border-hairline-strong font-serif text-[17px] leading-[1.25] text-ink transition-colors hover:border-accent hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        href={benchmark.url}
                        rel="noopener"
                        target="_blank"
                        title={benchmark.sourceLabel}
                      >
                        {benchmark.name}
                      </a>
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
                  </td>
                  <td
                    className={`k3-cell${scores[0] === bestScore ? " best-score" : ""}`}
                    data-best={scores[0] === bestScore || undefined}
                  >
                    {benchmark.score}
                  </td>
                  {visibleAnchors.map((anchor, index) => (
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
            <tr className="border-t-2 border-ink">
              <th
                className="py-2 pr-4 font-mono text-[10px] font-medium uppercase tracking-[.1em] text-ink-faint"
                scope="row"
              >
                {dictionary.bench.wins}
              </th>
              <td className="k3-cell font-bold">{wins[0]}</td>
              {visibleAnchors.map((anchor, index) => (
                <td className="bench-num text-ink last:pr-0" key={anchor.name}>{wins[index + 1]}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
