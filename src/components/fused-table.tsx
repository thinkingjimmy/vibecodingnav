/**
 * [INPUT]: 依赖按模型对齐的名次、综合分、维度列头与排序文案
 * [OUTPUT]: 对外提供场景页的融合表：综合分/上榜列 + 一列一张榜的原始名次；列头单行（图标+标签+排序箭头），超出时表内横向滚动，模型/综合分/上榜列可 sticky
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
const MODEL_W = "16rem";
const COMPOSITE_W = "5.5rem";
const APPEARS_W = "5.5rem";
const BOARD_W = "10rem";
const STICKY_MODEL = "0";
const STICKY_COMPOSITE = MODEL_W;
const STICKY_APPEARS = `calc(${MODEL_W} + ${COMPOSITE_W})`;

type Fusion = ReturnType<typeof fuseScenario>;
type SortKey = "model" | "composite" | "count" | number;
type FusionColumn = Fusion["columns"][number];

export function FusedTable({
  fusion,
  dict,
  syncLabel,
}: {
  fusion: Fusion;
  dict: Dictionary;
  syncLabel: string;
}) {
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
  const headScrollRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLTableElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const toggle = (key: SortKey) => setSort((current) => current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "model" ? "asc" : key === "composite" ? "desc" : "asc" });
  const minWidth = `${27 + fusion.columns.length * 10}rem`;
  const cols = () => (
    <colgroup>
      <col style={{ width: MODEL_W }} />
      <col style={{ width: COMPOSITE_W }} />
      <col style={{ width: APPEARS_W }} />
      {fusion.columns.map((column) => <col key={column.id} style={{ width: BOARD_W }} />)}
    </colgroup>
  );
  const head = (
    <tr className="text-[12px] text-faint">
      <SortHeader
        label={dict.scenario.colModel}
        active={sort.key === "model"}
        dir={sort.dir}
        onClick={() => toggle("model")}
        sortLabel={dict.scenario.sortBy}
        stickyClass="sticky left-0 z-40"
        stickyLeft={STICKY_MODEL}
      />
      <SortHeader
        label={dict.scenario.colComposite}
        active={sort.key === "composite"}
        dir={sort.dir}
        onClick={() => toggle("composite")}
        sortLabel={dict.scenario.sortBy}
        stickyClass="sticky z-40"
        stickyLeft={STICKY_COMPOSITE}
      />
      <SortHeader
        label={dict.scenario.colAppears}
        active={sort.key === "count"}
        dir={sort.dir}
        onClick={() => toggle("count")}
        sortLabel={dict.scenario.sortBy}
        stickyClass="sticky z-40"
        stickyLeft={STICKY_APPEARS}
      />
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
    const headScroll = headScrollRef.current;
    const headTable = headRef.current;
    const body = tableRef.current;
    if (!scroll || !headScroll || !headTable || !body) return;
    const apply = () => {
      headTable.style.width = `${body.offsetWidth}px`;
      headScroll.scrollLeft = scroll.scrollLeft;
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
      <div className="px-4">
        <div data-fused-toolbar className="flex h-11 items-center justify-between gap-4 text-[13px] text-mfg">
          <span className="text-fg">{dict.scenario.sortByComposite}</span>
          <span className="num shrink-0 text-faint">{syncLabel}</span>
        </div>
      </div>
      <ScoreBreakdownProvider>
        <div className="sticky z-30 bg-bg" style={{ top: "var(--site-nav, 3.5rem)" }}>
          <div ref={headScrollRef} className="overflow-x-hidden border-b border-line px-4">
            <table ref={headRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
              {cols()}
              <thead data-fused-head>{head}</thead>
            </table>
          </div>
        </div>
        <div ref={scrollRef} data-fused-scroll className="overflow-x-auto px-4">
          <table ref={tableRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
            {cols()}
            <tbody>
              {shown.map((row) => (
                <tr key={row.key} className="rowh border-b border-line">
                  <td className="sticky left-0 z-20 max-w-0 overflow-hidden bg-bg px-2 py-2.5" style={{ left: STICKY_MODEL }}>
                    <ModelName name={row.name} href={row.href} vendor={row.vendor} letter={row.letter} />
                  </td>
                  <td className="sticky z-20 num bg-bg px-2 py-2.5 font-medium" style={{ left: STICKY_COMPOSITE }}>{row.compositeLabel}</td>
                  <td className="sticky z-20 num bg-bg px-2 py-2.5 text-mfg" style={{ left: STICKY_APPEARS }}>{row.count}/{row.total}</td>
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
    <th className="bg-bg px-2 py-2.5 align-middle font-normal whitespace-nowrap">
      <ColumnInfoPopover
        label={sortLabel.replace("{name}", column.label)}
        render={(props) => {
          const { onClick: triggerClick, ...triggerProps } = props;
          return (
            <button
              {...triggerProps}
              type="button"
              className="group inline-flex items-center gap-1.5 whitespace-nowrap outline-none"
              onClick={(event) => {
                if (typeof triggerClick === "function") triggerClick(event);
                onClick();
              }}
            >
              <span className="inline-flex shrink-0 text-fg">
                <BoardDimensionIcon name={column.icon} size={14} />
              </span>
              <span className="whitespace-nowrap text-[13px] font-medium text-fg">{column.label}</span>
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

function SortHeader({
  label,
  active,
  dir,
  onClick,
  sortLabel,
  stickyClass,
  stickyLeft,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  sortLabel: string;
  stickyClass: string;
  stickyLeft: string;
}) {
  return (
    <th
      className={`${stickyClass} bg-bg px-2 py-2.5 align-middle text-left font-normal whitespace-nowrap`}
      style={{ left: stickyLeft }}
    >
      <button
        type="button"
        className="group inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-medium text-fg"
        aria-label={sortLabel.replace("{name}", label)}
        onClick={onClick}
      >
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
