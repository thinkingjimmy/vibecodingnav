/**
 * [INPUT]: 依赖按模型对齐的名次、综合分、维度列头与排序文案
 * [OUTPUT]: 对外提供场景页的融合表：综合分/上榜列 + 一列一张榜的原始名次；列头为同行图标与白话维度，悬停锚定弹层看基准详情（标题链到基准页）
 * [POS]: src/components 的场景融合表
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { fuseScenario } from "@/lib/catalog";
import type { Dictionary, VendorId } from "@/lib/contracts";
import { BoardDimensionIcon } from "./board-dimension-icon";
import { ColumnInfoPopover } from "./column-info-popover";
import { ScoreBreakdown, ScoreBreakdownProvider } from "./score-breakdown";
import { VendorMark } from "./vendor-mark";

const PAGE = 20;
type Fusion = ReturnType<typeof fuseScenario>;
type SortKey = "model" | "composite" | "count" | number;
type FusionColumn = Fusion["columns"][number];

export function FusedTable({ fusion, dict }: { fusion: Fusion; dict: Dictionary }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "composite", dir: "desc" });
  const [expanded, setExpanded] = useState(false);
  const rows = useMemo(() => {
    const copy = [...fusion.rows];
    const dir = sort.dir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      if (sort.key === "model") return a.name.localeCompare(b.name, "zh-CN") * dir;
      if (sort.key === "composite") {
        if (a.composite == null && b.composite == null) return ((a.primaryRank ?? 9999) - (b.primaryRank ?? 9999)) * dir;
        if (a.composite == null) return 1;
        if (b.composite == null) return -1;
        return (Math.round(a.composite) - Math.round(b.composite) || (a.primaryRank ?? 9999) - (b.primaryRank ?? 9999)) * dir;
      }
      if (sort.key === "count") return (a.count - b.count || (b.composite ?? -1) - (a.composite ?? -1)) * dir;
      const left = a.cells[sort.key];
      const right = b.cells[sort.key];
      if (!left && !right) return (b.composite ?? -1) - (a.composite ?? -1);
      if (!left) return 1;
      if (!right) return -1;
      return (left.rank - right.rank) * dir;
    });
    return copy;
  }, [fusion.rows, sort]);
  const shown = expanded ? rows : rows.slice(0, PAGE);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLTableElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const toggle = (key: SortKey) => setSort((current) => current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "model" ? "asc" : key === "composite" ? "desc" : "asc" });
  const minWidth = `${28 + fusion.columns.length * 7}rem`;
  const cols = () => (
    <colgroup>
      <col style={{ width: "16rem" }} />
      <col style={{ width: "6rem" }} />
      <col style={{ width: "5rem" }} />
      {fusion.columns.map((column) => <col key={column.id} />)}
    </colgroup>
  );
  const head = (
    <tr className="text-[12px] text-faint">
      <SortHeader label={dict.scenario.colModel} active={sort.key === "model"} dir={sort.dir} onClick={() => toggle("model")} sortLabel={dict.scenario.sortBy} />
      <SortHeader label={dict.scenario.colComposite} active={sort.key === "composite"} dir={sort.dir} onClick={() => toggle("composite")} sortLabel={dict.scenario.sortBy} />
      <SortHeader label={dict.scenario.colAppears} active={sort.key === "count"} dir={sort.dir} onClick={() => toggle("count")} sortLabel={dict.scenario.sortBy} />
      {fusion.columns.map((column, index) => (
        <DimensionHeader
          key={column.id}
          column={column}
          active={sort.key === index}
          dir={sort.dir}
          onClick={() => toggle(index)}
          sortLabel={dict.scenario.sortBy}
          dict={dict}
        />
      ))}
    </tr>
  );

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    const headTable = headRef.current;
    const body = tableRef.current;
    if (!scroll || !track || !headTable || !body) return;
    const apply = () => {
      headTable.style.width = `${body.offsetWidth}px`;
      track.style.transform = `translateX(${-scroll.scrollLeft}px)`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(body);
    observer.observe(scroll);
    scroll.addEventListener("scroll", apply, { passive: true });
    return () => {
      observer.disconnect();
      scroll.removeEventListener("scroll", apply);
    };
  }, [shown, sort, fusion.columns]);

  return (
    <div>
      <ScoreBreakdownProvider>
        <div className="sticky z-30 bg-bg" style={{ top: "var(--site-nav, 3.5rem)" }}>
          <div className="overflow-hidden border-b border-line">
            <div ref={trackRef} className="px-4">
              <table ref={headRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
                {cols()}
                <thead data-fused-head>{head}</thead>
              </table>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="overflow-x-auto px-4">
          <table ref={tableRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
            {cols()}
            <tbody>
              {shown.map((row) => (
                <tr key={row.key} className="rowh border-b border-line">
                  <td className="max-w-0 overflow-hidden px-2 py-2.5">
                    <ModelName name={row.name} href={row.href} vendor={row.vendor} letter={row.letter} />
                  </td>
                  <td className="num px-2 py-2.5 font-medium">{row.compositeLabel}</td>
                  <td className="num px-2 py-2.5 text-mfg">{row.count}/{row.total}</td>
                  {row.cells.map((cell, index) => {
                    const column = fusion.columns[index]!;
                    if (!cell?.tip) {
                      return (
                        <td key={column.id} className="num px-2 py-2.5">{cell ? cell.rank : "—"}</td>
                      );
                    }
                    return (
                      <ScoreBreakdown
                        key={column.id}
                        content={{ title: cell.tip }}
                        label={`${row.name}, ${column.label}: ${cell.tip}`}
                        render={(props) => (
                          <td {...props} className="num cursor-default px-2 py-2.5 outline-none">
                            {cell.rank}
                          </td>
                        )}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScoreBreakdownProvider>
      {rows.length > PAGE ? (
        <div className="px-4 pt-4">
          <button type="button" className="text-[13px] text-mfg hover:text-fg" onClick={() => setExpanded((value) => !value)}>
            {expanded ? dict.scenario.showLess : dict.scenario.showAll.replace("{count}", String(rows.length))}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DimensionHeader({
  column,
  active,
  dir,
  onClick,
  sortLabel,
  dict,
}: {
  column: FusionColumn;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  sortLabel: string;
  dict: Dictionary;
}) {
  return (
    <th className="bg-bg px-2 pb-2.5 align-bottom font-normal">
      <ColumnInfoPopover
        label={sortLabel.replace("{name}", column.label)}
        render={(props) => {
          const { onClick: triggerClick, ...triggerProps } = props;
          return (
            <button
              {...triggerProps}
              type="button"
              className="group inline-flex w-full items-center gap-1.5 outline-none"
              onClick={(event) => {
                if (typeof triggerClick === "function") triggerClick(event);
                onClick();
              }}
            >
              <span className="inline-flex shrink-0 text-fg">
                <BoardDimensionIcon name={column.icon} size={14} />
              </span>
              <span className="text-[13px] font-medium text-fg">{column.label}</span>
              <SortMark active={active} dir={dir} />
            </button>
          );
        }}
      >
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link href={column.href} className="font-medium text-fg link-u">
              {column.name}
            </Link>
            <span className="num text-[11.5px] text-faint">{dict.scenario.scoringWeight.replace("{weight}", column.weightLabel)}</span>
          </div>
          <p className="text-[12.5px] leading-snug text-mfg">{column.blurb}</p>
          {column.runBy ? (
            <p className="text-[12px] text-mfg">
              <span className="text-faint">{dict.scenario.scoringRunBy}</span> {column.runBy}
            </p>
          ) : null}
          {column.dataMeta ? <p className="num text-[11.5px] text-faint">{column.dataMeta}</p> : null}
        </div>
      </ColumnInfoPopover>
    </th>
  );
}

function ModelName({ name, href, vendor, letter }: { name: string; href?: string; vendor?: VendorId; letter?: string }) {
  const body = (
    <span className="flex min-w-0 items-center gap-2.5">
      <VendorMark vendor={vendor} letter={letter} />
      <span className="truncate">{name}</span>
    </span>
  );
  if (!href) return body;
  return <Link href={href} className="block min-w-0 no-underline">{body}</Link>;
}

function SortHeader({ label, active, dir, onClick, sortLabel }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void; sortLabel: string }) {
  return (
    <th className="px-2 pb-2.5 align-bottom text-left font-normal">
      <button type="button" className="group inline-flex items-center gap-1 text-[13px] font-medium text-fg" aria-label={sortLabel.replace("{name}", label)} onClick={onClick}>
        {label}
        <SortMark active={active} dir={dir} />
      </button>
    </th>
  );
}

function SortMark({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  const Icon = active && dir === "desc" ? CaretDown : CaretUp;
  return (
    <Icon
      size={12}
      aria-hidden
      className={active ? "shrink-0 text-fg" : "shrink-0 opacity-0 text-faint group-hover:opacity-50 group-focus-visible:opacity-50"}
    />
  );
}
