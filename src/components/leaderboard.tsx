/**
 * [INPUT]: 依赖榜单行、来源列与筛选文案
 * [OUTPUT]: 对外提供按来源列展示的完整榜单，超过 20 行可展开
 * [POS]: src/components 的场景榜单交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
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
    <span className="flex min-w-0 items-center gap-2.5">
      <VendorMark vendor={row.vendor} letter={row.letter} />
      <span className="min-w-0">
        <span className={`block truncate ${row.rank <= 5 ? "font-medium" : ""}`}>{row.name}</span>
        {meta ? <span className="block truncate text-[11px] text-faint">{meta}</span> : null}
      </span>
      {row.effort && table !== "terminal" ? <span className="num shrink-0 text-[11px] text-faint">{row.effort}</span> : null}
      {row.preliminary ? <span className="shrink-0 text-[11px] text-faint">{dict.scenario.preliminary}</span> : null}
    </span>
  );
  if (!row.href) return body;
  return <Link href={row.href} className="no-underline">{body}</Link>;
}

export function Leaderboard({ rows, dict, table, filter: mode }: { rows: BoardRow[]; dict: Dictionary; table: BoardTable; filter: SourceFilter | "none" }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(() => rows.filter((row) => matches(row, filter, mode)), [filter, mode, rows]);
  const shown = expanded ? visible : visible.slice(0, PAGE);
  const headers = columns(table, dict);

  return (
    <div>
      {mode !== "none" ? (
        <div className="flex flex-wrap items-center gap-1 px-4 pb-5 text-[13px]">
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
      <div className="overflow-x-auto px-4">
        <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="num h-9 border-b border-line text-[12px] text-faint">
              {headers.map((header) => <th key={header.key} className={`px-2 font-normal ${header.align === "right" ? "text-right" : "text-left"}`}>{header.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr><td className="px-2 py-6 text-mfg" colSpan={headers.length}>{dict.scenario.empty}</td></tr>
            ) : shown.map((row) => (
              <tr key={row.key} className="rowh border-b border-line">
                {headers.map((header) => (
                  <td key={header.key} className={`px-2 py-2.5 align-middle ${header.align === "right" ? "num text-right text-mfg" : "text-left"}`}>{header.cell(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
  align?: "right";
  cell: (row: BoardRow) => ReactNode;
}

function columns(table: BoardTable, dict: Dictionary): Column[] {
  const text = dict.scenario;
  const rank = (row: BoardRow) => <span className={row.rank <= 3 ? "text-fg" : ""}>{row.rank}</span>;
  const model = (row: BoardRow) => <ModelCell row={row} table={table} dict={dict} />;
  const right = (key: string, label: string, cell: (row: BoardRow) => ReactNode): Column => ({ key, label, align: "right", cell });
  const left = (key: string, label: string, cell: (row: BoardRow) => ReactNode): Column => ({ key, label, cell });
  if (table === "webdev") {
    return [
      left("rank", text.colRank, rank),
      right("spread", text.colSpread, (row) => row.rankSpread),
      left("model", text.colModel, model),
      right("score", text.colScore, (row) => row.score),
      right("ci", text.colCi, (row) => row.ci),
      right("votes", text.colVotes, (row) => row.votes),
      right("price", text.colPrice, (row) => row.price),
      right("context", text.colContext, (row) => row.context ?? "—"),
    ];
  }
  if (table === "android-long") {
    return [
      left("rank", text.colRank, rank),
      left("model", text.colModel, model),
      left("agent", text.colAgent, (row) => row.agent),
      right("pass", text.colPass, (row) => row.score),
      right("ci", text.colCi, (row) => row.ci),
      right("completion", text.colCompletion, (row) => row.completion),
      right("latency", text.colLatency, (row) => row.latency),
      right("cost", text.colCost, (row) => row.price),
    ];
  }
  if (table === "android-1") {
    return [
      left("rank", text.colRank, rank),
      left("model", text.colModel, model),
      right("pass", text.colPass, (row) => row.score),
      right("ci", text.colCi, (row) => row.ci),
      right("latency", text.colLatency, (row) => row.latency),
      right("cost", text.colCost, (row) => row.price),
    ];
  }
  if (table === "terminal") {
    return [
      left("rank", text.colRank, rank),
      left("agent", text.colAgent, (row) => row.agent),
      left("model", text.colModel, model),
      left("effort", text.colEffort, (row) => row.effort),
      right("accuracy", text.colAccuracy, (row) => row.score),
      right("date", text.colRelease, (row) => row.releaseDate),
      left("agentOrg", text.colAgentOrg, (row) => row.agentOrg),
      left("org", text.colModelOrg, (row) => row.org),
      right("tokens", text.colTokens, (row) => row.tokens),
      right("cost", text.colRunCost, (row) => row.price),
    ];
  }
  return [
    left("rank", text.colRank, rank),
    left("model", text.colModel, model),
    right("score", text.colScore, (row) => row.score),
  ];
}
