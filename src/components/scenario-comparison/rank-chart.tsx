/**
 * [INPUT]: Fused results, comparison layout, localized text, and vendor marks.
 * [OUTPUT]: RankChart with relative ranks, model highlighting, and original scores.
 * [POS]: Interactive chart inside ScenarioComparison; the full table is its sibling view.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { ArrowsLeftRight } from "@phosphor-icons/react";
import Link from "next/link";
import { useId, useMemo, useState, type CSSProperties } from "react";
import type { Dictionary } from "@/lib/contracts";
import { VendorMark } from "../vendor-mark";
import { ModelDetail } from "./model-detail";
import { COLUMN_WIDTH, ROW_HEIGHT, TOP, comparisonSeries, seriesColor, type Fusion } from "./rank-layout";
import styles from "./rank-chart.module.css";

export function RankChart({ fusion, dict, syncLabel }: { fusion: Fusion; dict: Dictionary; syncLabel: string }) {
  const copy = dict.scenario;
  const descriptionId = useId();
  const [limit, setLimit] = useState(15);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const rows = useMemo(() => fusion.rows.slice(0, limit), [fusion.rows, limit]);
  const series = useMemo(() => comparisonSeries(rows, fusion.columns.length), [rows, fusion.columns.length]);
  const selected = rows.find((row) => row.key === selectedKey);
  const activeKey = selected?.key ?? hoveredKey ?? focusedKey;
  const height = TOP * 2 + Math.max(0, rows.length - 1) * ROW_HEIGHT;
  const width = fusion.columns.length * COLUMN_WIDTH;
  const select = (key: string) => setSelectedKey((current) => current === key ? null : key);

  return (
    <div className={`${styles.chart} px-4`} data-rank-comparison onKeyDown={(event) => { if (event.key === "Escape") setSelectedKey(null); }}>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 text-[13px]">
        <p className="text-mfg">{copy.comparisonDescription.replace("{count}", String(rows.length))}</p>
        <label className="inline-flex shrink-0 items-center gap-2 text-mfg">
          {copy.comparisonModels}
          <select
            value={limit}
            onChange={(event) => { setLimit(Number(event.target.value)); setSelectedKey(null); }}
            className="min-h-9 cursor-pointer rounded-md border border-bd bg-bg px-2 text-fg"
          >
            {[10, 15, 20].map((count) => <option key={count} value={count}>{copy.comparisonTop.replace("{count}", String(count))}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-5 flex items-center gap-1.5 text-[12px] text-mfg sm:hidden"><ArrowsLeftRight size={14} aria-hidden />{copy.comparisonScroll}</p>
      <div
        data-rank-scroll
        role="region"
        aria-label={copy.comparisonChart}
        aria-describedby={descriptionId}
        tabIndex={0}
        className="mt-4 overflow-x-auto overscroll-x-contain pb-2 sm:mt-7"
      >
        <div className={styles.canvas} style={{ "--rank-plot-width": `${width}px` } as CSSProperties}>
          <div className={`${styles.labels} flex h-16 items-start justify-end pr-5 pt-1 text-[11px] text-mfg`}>{copy.colModel}</div>
          <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${fusion.columns.length}, minmax(0, 1fr))` }}>
            {fusion.columns.map((column) => (
              <Link key={column.id} href={column.href} title={column.blurb} className="flex flex-col items-center gap-1 px-2 text-center hover:underline hover:underline-offset-4" data-rank-column>
                <span className="text-[12px] leading-[17px] font-semibold">{column.label}</span>
                <span className="text-[10px] leading-[14px] text-mfg">{column.shortLabel}</span>
              </Link>
            ))}
          </div>
          <div className={styles.labels} style={{ height }}>
            {[...series].sort((a, b) => a.labelY - b.labelY).map(({ row, labelY, featured }) => (
              <ModelDetail
                key={row.key}
                row={row}
                columns={fusion.columns}
                dict={dict}
                open={selected?.key === row.key}
                onOpenChange={(open) => setSelectedKey((current) => open ? row.key : current === row.key ? null : current)}
                trigger={(
                  <button
                    type="button"
                    className={styles.model}
                    data-rank-model={row.key}
                    aria-pressed={selected?.key === row.key}
                    onPointerEnter={(event) => { if (event.pointerType !== "touch") setHoveredKey(row.key); }}
                    onPointerLeave={() => setHoveredKey(null)}
                    onFocus={() => setFocusedKey(row.key)}
                    onBlur={() => setFocusedKey(null)}
                    style={{ top: labelY, opacity: activeKey && activeKey !== row.key ? 0.4 : 1, fontWeight: featured || activeKey === row.key ? 600 : 400 }}
                  >
                    <span className="min-w-0 truncate" title={row.name}>{row.name}</span>
                    <span className="shrink-0" style={{ color: seriesColor(row.vendor) }}><VendorMark vendor={row.vendor} letter={row.letter} className="!text-current" /></span>
                  </button>
                )}
              />
            ))}
          </div>
          <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height} aria-hidden="true" data-rank-plot>
            {rows.map((row, index) => <line key={row.key} x1={COLUMN_WIDTH / 2} x2={width - COLUMN_WIDTH / 2} y1={TOP + index * ROW_HEIGHT} y2={TOP + index * ROW_HEIGHT} stroke="color-mix(in oklab, var(--foreground) 20%, var(--background))" strokeWidth="1" strokeDasharray="2 5" />)}
            {[...series].sort((a, b) => Number(a.row.key === activeKey) - Number(b.row.key === activeKey) || Number(a.featured) - Number(b.featured)).map(({ row, points, path, featured, labelY }) => {
              const active = row.key === activeKey;
              const emphasis = active || (!activeKey && featured);
              return (
                <g
                  key={row.key}
                  data-rank-series={row.key}
                  className={styles.series}
                  style={{ color: seriesColor(row.vendor), opacity: activeKey && !active ? 0.12 : 1 }}
                  onPointerEnter={(event) => { if (event.pointerType !== "touch") setHoveredKey(row.key); }}
                  onPointerLeave={() => setHoveredKey(null)}
                  onClick={() => select(row.key)}
                >
                  <title>{row.name}</title>
                  {points[0] && <path d={`M 0 ${labelY} C 25 ${labelY}, 35 ${points[0].y}, ${points[0].x} ${points[0].y}`} fill="none" stroke="currentColor" strokeWidth={emphasis ? 2.6 : 1.3} />}
                  <path d={path} fill="none" stroke="transparent" strokeWidth="16" />
                  <path d={path} fill="none" stroke="currentColor" strokeWidth={emphasis ? 2.6 : 1.3} pointerEvents="none" />
                  {points.map((point, index) => point ? (
                    <g key={fusion.columns[index]!.id} data-rank-point={index} data-rank={point.rank} data-source-rank={point.sourceRank}>
                      <title>{`${row.name} · ${fusion.columns[index]!.label}: ${copy.comparisonRank} ${point.rank}, ${copy.comparisonSourceRank} ${point.sourceRank} · ${row.cells[index]!.tip}`}</title>
                      <circle cx={point.x} cy={point.y} r="12" fill="transparent" />
                      <circle cx={point.x} cy={point.y} r={emphasis ? 10 : 3} fill="currentColor" stroke="var(--background)" strokeWidth={emphasis ? 2 : 0} />
                      {emphasis && <text x={point.x} y={point.y} dy="0.35em" textAnchor="middle" fill={row.vendor === "openai" ? "var(--background)" : "var(--rank-label-ink)"} fontSize="10" fontWeight="600" pointerEvents="none">{point.rank}</text>}
                    </g>
                  ) : null)}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-2 text-[12px] leading-relaxed text-mfg">
        <p id={descriptionId}>{copy.comparisonNote} <span className="text-fg">{copy.comparisonHint}</span></p>
        <span className="shrink-0 text-faint">{syncLabel}</span>
      </div>
    </div>
  );
}
