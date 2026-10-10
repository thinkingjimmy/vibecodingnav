/**
 * [INPUT]: 依赖榜单行与筛选文案
 * [OUTPUT]: 对外提供可筛选的完整榜单，默认全部在服务端首屏可见
 * [POS]: src/components 的场景榜单交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { isPermissiveLicense } from "@/content/validate";
import type { BoardRow } from "@/lib/catalog";
import type { Dictionary } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

type Filter = "all" | "closed" | "open" | "vendor";

export function Leaderboard({ rows, dict, priceKind, showFilters = true }: { rows: BoardRow[]; dict: Dictionary; priceKind: "token" | "run"; showFilters?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = useMemo(() => {
    if (filter === "closed") return rows.filter((row) => row.licenseKind === "proprietary");
    if (filter === "open") return rows.filter((row) => isPermissiveLicense(row.licenseKind));
    if (filter === "vendor") {
      const best = new Map<string, BoardRow>();
      for (const row of rows) {
        const current = best.get(row.vendor);
        if (!current || row.rank < current.rank) best.set(row.vendor, row);
      }
      return [...best.values()].sort((a, b) => a.rank - b.rank);
    }
    return rows;
  }, [filter, rows]);
  const min = Math.min(...rows.map((row) => row.scoreNumber));
  const max = Math.max(...rows.map((row) => row.scoreNumber));
  const span = Math.max(max - min, 1);
  const pad = span * 0.08;
  const pos = (value: number) => Math.min(100, Math.max(0, ((value - (min - pad)) / (span + pad)) * 100));
  const showVotes = rows.some((row) => row.votes);
  const showContext = rows.some((row) => row.context);
  const wide = showVotes && showContext;
  const cols = wide ? "grid-cols-[44px_1fr_210px_80px_120px_60px]" : "grid-cols-[44px_1fr_220px_100px]";
  const filters: [Filter, string][] = [
    ["all", dict.scenario.filterAll],
    ["closed", dict.scenario.filterClosed],
    ["open", dict.scenario.filterOpen],
    ["vendor", dict.scenario.filterVendor],
  ];

  return (
    <div>
      {showFilters ? (
        <div className="flex flex-wrap items-center gap-1 px-4 pb-5 text-[13px]">
          {filters.map(([key, label]) => key === filter ? (
            <span key={key} className="pill">{label}</span>
          ) : (
            <button key={key} type="button" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => setFilter(key)}>{label}</button>
          ))}
        </div>
      ) : null}
      <div className="overflow-x-auto px-4">
        <div className="min-w-[720px]">
          <div className={`num grid h-9 items-center gap-3 border-b border-line text-[12px] text-faint ${cols}`}>
            <span>{dict.scenario.colRank}</span>
            <span>{dict.scenario.colModel}</span>
            <span>{dict.scenario.colScore}</span>
            {wide ? <span className="text-right">{dict.scenario.colVotes}</span> : <span className="text-right">{priceKind === "token" ? dict.scenario.colPrice : dict.scenario.colRunCost}</span>}
            {wide ? <span className="text-right">{dict.scenario.colPrice}</span> : null}
            {wide ? <span className="text-right">{dict.scenario.colContext}</span> : null}
          </div>
          {visible.length === 0 ? <p className="py-6 text-[14px] text-mfg">{dict.scenario.empty}</p> : null}
          {visible.map((row, index) => {
            const low = row.ciLow ?? row.scoreNumber;
            const high = row.ciHigh ?? row.scoreNumber;
            return (
              <Link key={row.key} href={row.href} className={`rowh grid items-center gap-3 py-2.5 text-[14px] ${cols} ${index < visible.length - 1 ? "border-b border-line" : ""}`}>
                <span>
                  <span className={`num block text-[13px] ${row.rank <= 3 ? "text-fg" : "text-mfg"}`}>{row.rank}</span>
                  {row.rankSpread ? <span className="num block text-[10.5px] text-faint">{row.rankSpread}</span> : null}
                </span>
                <span className="flex min-w-0 items-center gap-2.5">
                  <VendorMark vendor={row.vendor} />
                  <span className={`truncate ${row.rank <= 5 ? "font-medium" : ""}`}>{row.name}</span>
                  {row.effort ? <span className="num text-[11px] text-faint">{row.effort}</span> : null}
                  {row.license ? <span className="num text-[10.5px] text-mfg">{row.license}</span> : null}
                  {row.preliminary ? <span className="text-[11px] text-faint">{dict.scenario.preliminary}</span> : null}
                </span>
                <span className="flex items-center gap-3">
                  <span className={`num w-[38px] ${row.rank <= 5 ? "" : "text-mfg"}`}>{row.score}</span>
                  <span className="relative h-1.5 flex-1 rounded-[1px] bg-muted">
                    <i className="absolute inset-y-0 left-0 rounded-[1px] bg-bar" style={{ width: `${pos(row.scoreNumber)}%` }} />
                    {row.ciLow != null ? <i className="absolute -inset-y-[3px] border-x border-faint" style={{ left: `${pos(low)}%`, width: `${Math.max(pos(high) - pos(low), 0)}%` }} /> : null}
                  </span>
                  <span className="num w-[52px] text-[11px] text-faint">{row.ci}</span>
                </span>
                {wide ? <span className="num text-right text-mfg">{row.votes}</span> : <span className="num text-right text-mfg">{row.price}</span>}
                {wide ? <span className="num text-right text-mfg">{row.price}</span> : null}
                {wide ? <span className="num text-right text-mfg">{row.context ?? "—"}</span> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
