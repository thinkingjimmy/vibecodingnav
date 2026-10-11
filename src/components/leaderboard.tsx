/**
 * [INPUT]: 依赖榜单行、来源列与筛选文案
 * [OUTPUT]: 对外提供按来源列展示的完整榜单，筛选和表头在滚动时吸在导航下，超过 20 行可展开
 * [POS]: src/components 的基准页榜单交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { BoardRow } from "@/lib/catalog";
import type { BoardTable, Dictionary, SourceFilter } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

const PAGE = 20;
type Filter = "all" | "closed" | "open";

function matches(row: BoardRow, filter: Filter, mode: SourceFilter | "none") {
  if (filter === "all" || mode === "none") return true;
  const open = mode === "weights" ? row.weights === "open" : Boolean(row.license && row.license !== "Proprietary");
  return filter === "open" ? open : !open;
}

function ModelCell({ row, table, dict }: { row: BoardRow; table: BoardTable; dict: Dictionary }) {
  const meta = table === "webdev" ? [row.org, row.license].filter(Boolean).join(" · ") : "";
  const body = (
    <span className="flex w-full min-w-0 items-center gap-2.5">
      <VendorMark vendor={row.vendor} letter={row.letter} />
      <span className="min-w-0">
        <span className={`block truncate ${row.rank <= 5 ? "font-medium" : ""}`}>{row.name}</span>
        {meta ? <span className="block truncate text-[11px] text-faint">{meta}</span> : null}
      </span>
      {row.effort && table !== "terminal" ? <span className="num shrink-0 text-[11px] text-faint">{row.effort}</span> : null}
      {row.preliminary ? <span className="shrink-0 text-[11px] text-faint">{dict.scenario.preliminary}</span> : null}
    </span>
  );
  const className = "block min-w-0 max-w-full no-underline";
  if (!row.href) return <span className={className}>{body}</span>;
  return <Link href={row.href} className={className}>{body}</Link>;
}

function Cols({ headers }: { headers: Column[] }) {
  return (
    <colgroup>
      {headers.map((header) => <col key={header.key} style={header.width ? { width: header.width } : undefined} />)}
    </colgroup>
  );
}

export function Leaderboard({ rows, dict, table, filter: mode }: { rows: BoardRow[]; dict: Dictionary; table: BoardTable; filter: SourceFilter | "none" }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLTableElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const visible = useMemo(() => rows.filter((row) => matches(row, filter, mode)), [filter, mode, rows]);
  const shown = expanded ? visible : visible.slice(0, PAGE);
  const headers = columns(table, dict);
  const minWidth = tableMin(table);

  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const track = trackRef.current;
    const head = headRef.current;
    const body = tableRef.current;
    if (!scroll || !track || !head || !body) return;
    const apply = () => {
      head.style.width = `${body.offsetWidth}px`;
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
  }, [shown, filter, table]);

  return (
    <div>
      <div className="sticky top-14 z-30 bg-bg">
        {mode !== "none" ? (
          <div data-board-bar className="flex flex-wrap items-center gap-1 px-4 pb-5 text-[13px]">
            {([
              ["all", dict.scenario.filterAll],
              ["closed", dict.scenario.filterClosed],
              ["open", dict.scenario.filterOpen],
            ] as [Filter, string][]).map(([key, label]) => key === filter ? (
              <span key={key} className="pill">{label}</span>
            ) : (
              <button key={key} type="button" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => { setFilter(key); setExpanded(false); }}>{label}</button>
            ))}
          </div>
        ) : null}
        <div className="overflow-hidden border-b border-line">
          <div ref={trackRef} className="px-4">
            <table ref={headRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
              <Cols headers={headers} />
              <thead data-board-head>
                <tr className="num h-9 text-[12px] text-faint">
                  {headers.map((header) => (
                    <th key={header.key} className={`h-9 overflow-hidden bg-bg px-2 font-normal whitespace-nowrap ${header.align === "right" ? "text-right" : "text-left"}`}>{header.label}</th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
      <div ref={scrollRef} data-board-scroll className="overflow-x-auto">
        <div className="px-4">
          <table ref={tableRef} className="w-full table-fixed border-separate border-spacing-0 text-left text-[14px]" style={{ minWidth }}>
            <Cols headers={headers} />
            <tbody>
              {shown.length === 0 ? (
                <tr><td className="border-b border-line px-2 py-6 text-mfg" colSpan={headers.length}>{dict.scenario.empty}</td></tr>
              ) : shown.map((row) => (
                <tr key={row.key} className="rowh">
                  {headers.map((header) => (
                    <td key={header.key} className={`overflow-hidden border-b border-line px-2 py-2.5 align-middle ${header.align === "right" ? `num text-right text-mfg ${header.wrap ? "whitespace-normal" : "whitespace-nowrap"}` : `max-w-0 text-left ${header.width ? "whitespace-nowrap" : ""}`}`}>{header.cell(row)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {visible.length > PAGE ? (
        <div className="px-4 pt-4">
          <button type="button" className="text-[13px] text-mfg hover:text-fg" onClick={() => setExpanded((value) => !value)}>
            {expanded ? dict.scenario.showLess : dict.scenario.showAll.replace("{count}", String(visible.length))}
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface Column {
  key: string;
  label: string;
  /** 空着的那一列吃掉剩余宽度，筛选换行时其他列不动。 */
  width?: string;
  align?: "right";
  wrap?: boolean;
  cell: (row: BoardRow) => ReactNode;
}

function tableMin(table: BoardTable) {
  if (table === "terminal") return "72rem";
  if (table === "android-long") return "56rem";
  if (table === "webdev") return "48rem";
  if (table === "android-1") return "40rem";
  return "24rem";
}

function columns(table: BoardTable, dict: Dictionary): Column[] {
  const text = dict.scenario;
  const rank = (row: BoardRow) => <span className={row.rank <= 3 ? "text-fg" : ""}>{row.rank}</span>;
  const model = (row: BoardRow) => <ModelCell row={row} table={table} dict={dict} />;
  const right = (key: string, label: string, width: string, cell: (row: BoardRow) => ReactNode, wrap = false): Column => ({ key, label, width, align: "right", wrap, cell });
  const left = (key: string, label: string, width: string | undefined, cell: (row: BoardRow) => ReactNode): Column => ({ key, label, width, cell });
  if (table === "webdev") {
    return [
      left("rank", text.colRank, "3rem", rank),
      right("spread", text.colSpread, "5.5rem", (row) => row.rankSpread),
      left("model", text.colModel, undefined, model),
      right("score", text.colScore, "3.75rem", (row) => row.score),
      right("ci", text.colCi, "5.5rem", (row) => row.ci),
      right("votes", text.colVotes, "5rem", (row) => row.votes),
      right("price", text.colPrice, "8.75rem", (row) => row.price),
      right("context", text.colContext, "4.75rem", (row) => row.context ?? "—"),
    ];
  }
  if (table === "android-long") {
    return [
      left("rank", text.colRank, "3rem", rank),
      left("model", text.colModel, undefined, model),
      left("agent", text.colAgent, "9.5rem", (row) => row.agent),
      right("pass", text.colPass, "5.75rem", (row) => row.score),
      right("ci", text.colCi, "6.75rem", (row) => row.ci),
      right("completion", text.colCompletion, "5.75rem", (row) => row.completion),
      right("latency", text.colLatency, "6.75rem", (row) => row.latency),
      right("cost", text.colCost, "6.75rem", (row) => row.price),
    ];
  }
  if (table === "android-1") {
    return [
      left("rank", text.colRank, "3rem", rank),
      left("model", text.colModel, undefined, model),
      right("pass", text.colPass, "5.75rem", (row) => row.score),
      right("ci", text.colCi, "6.75rem", (row) => row.ci),
      right("latency", text.colLatency, "6.75rem", (row) => row.latency),
      right("cost", text.colCost, "6.75rem", (row) => row.price),
    ];
  }
  if (table === "terminal") {
    return [
      left("rank", text.colRank, "3rem", rank),
      left("agent", text.colAgent, "9.5rem", (row) => row.agent),
      left("model", text.colModel, undefined, model),
      left("effort", text.colEffort, "4.5rem", (row) => row.effort),
      right("accuracy", text.colAccuracy, "8.5rem", (row) => row.score),
      right("date", text.colRelease, "8rem", (row) => row.releaseDate),
      left("agentOrg", text.colAgentOrg, "6.5rem", (row) => row.agentOrg),
      left("org", text.colModelOrg, "6.5rem", (row) => row.org),
      right("tokens", text.colTokens, "5.5rem", (row) => row.tokens),
      right("cost", text.colRunCost, "9rem", (row) => row.price, true),
    ];
  }
  return [
    left("rank", text.colRank, "3rem", rank),
    left("model", text.colModel, undefined, model),
    right("score", text.colScore, "4.5rem", (row) => row.score),
  ];
}
