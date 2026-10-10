/**
 * [INPUT]: 依赖按模型对齐的名次、基准链接与排序文案
 * [OUTPUT]: 对外提供场景页的融合表：一列一张榜，格子是名次
 * [POS]: src/components 的场景融合表
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { CaretDown, CaretUp } from "@phosphor-icons/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { fuseScenario } from "@/lib/catalog";
import type { Dictionary, VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

const PAGE = 20;
type Fusion = ReturnType<typeof fuseScenario>;
type SortKey = "model" | "avg" | "count" | number;

export function FusedTable({ fusion, dict }: { fusion: Fusion; dict: Dictionary }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "avg", dir: "asc" });
  const [expanded, setExpanded] = useState(false);
  const rows = useMemo(() => {
    const copy = [...fusion.rows];
    const dir = sort.dir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      if (sort.key === "model") return a.name.localeCompare(b.name, "zh-CN") * dir;
      if (sort.key === "avg") return (a.avg - b.avg || b.count - a.count || (a.primaryRank ?? 9999) - (b.primaryRank ?? 9999)) * dir;
      if (sort.key === "count") return (a.count - b.count || a.avg - b.avg) * dir;
      const left = a.cells[sort.key];
      const right = b.cells[sort.key];
      if (!left && !right) return a.avg - b.avg;
      if (!left) return 1;
      if (!right) return -1;
      return (left.rank - right.rank) * dir;
    });
    return copy;
  }, [fusion.rows, sort]);
  const shown = expanded ? rows : rows.slice(0, PAGE);
  const toggle = (key: SortKey) => setSort((current) => current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "model" ? "asc" : "asc" });

  return (
    <div>
      <p className="max-w-[760px] px-4 pb-5 text-[13px] leading-relaxed text-faint">{dict.scenario.fusedNote}</p>
      <div className="overflow-x-auto px-4">
        <table className="w-full table-fixed border-collapse text-left text-[14px]" style={{ minWidth: `${28 + fusion.columns.length * 7}rem` }}>
          <colgroup>
            <col style={{ width: "16rem" }} />
            <col style={{ width: "6rem" }} />
            <col style={{ width: "5rem" }} />
            {fusion.columns.map((column) => <col key={column.id} />)}
          </colgroup>
          <thead>
            <tr className="num h-10 border-b border-line text-[12px] text-faint">
              <SortHeader label={dict.scenario.colModel} active={sort.key === "model"} dir={sort.dir} onClick={() => toggle("model")} sortLabel={dict.scenario.sortBy} />
              <SortHeader label={dict.scenario.colAvg} active={sort.key === "avg"} dir={sort.dir} align="right" onClick={() => toggle("avg")} sortLabel={dict.scenario.sortBy} />
              <SortHeader label={dict.scenario.colAppears} active={sort.key === "count"} dir={sort.dir} align="right" onClick={() => toggle("count")} sortLabel={dict.scenario.sortBy} />
              {fusion.columns.map((column, index) => (
                <th key={column.id} className="px-2 text-right font-normal">
                  <span className="inline-flex items-center justify-end gap-1">
                    <Link href={column.href} className="link-u">{column.label}</Link>
                    {column.tag ? <span className="text-[10px] text-faint">{column.tag}</span> : null}
                    <SortButton label={column.label} active={sort.key === index} dir={sort.dir} onClick={() => toggle(index)} sortLabel={dict.scenario.sortBy} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((row) => (
              <tr key={row.key} className="rowh border-b border-line">
                <td className="max-w-0 overflow-hidden px-2 py-2.5">
                  <ModelName name={row.name} href={row.href} vendor={row.vendor} letter={row.letter} />
                </td>
                <td className="num px-2 py-2.5 text-right">{row.avgLabel}</td>
                <td className="num px-2 py-2.5 text-right text-mfg">{row.count}/{row.total}</td>
                {row.cells.map((cell, index) => (
                  <td key={fusion.columns[index]!.id} className="num px-2 py-2.5 text-right" title={cell?.tip}>{cell ? cell.rank : "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function SortHeader({ label, active, dir, align, onClick, sortLabel }: { label: string; active: boolean; dir: "asc" | "desc"; align?: "right"; onClick: () => void; sortLabel: string }) {
  return (
    <th className={`px-2 font-normal ${align === "right" ? "text-right" : "text-left"}`}>
      <button type="button" className={`inline-flex items-center gap-1 ${align === "right" ? "flex-row-reverse" : ""}`} aria-label={sortLabel.replace("{name}", label)} onClick={onClick}>
        {label}
        <SortMark active={active} dir={dir} />
      </button>
    </th>
  );
}

function SortButton({ label, active, dir, onClick, sortLabel }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void; sortLabel: string }) {
  return (
    <button type="button" className="inline-flex items-center text-faint" aria-label={sortLabel.replace("{name}", label)} onClick={onClick}>
      <SortMark active={active} dir={dir} />
    </button>
  );
}

function SortMark({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <CaretUp className="opacity-0" size={12} aria-hidden />;
  return dir === "asc" ? <CaretUp size={12} aria-hidden /> : <CaretDown size={12} aria-hidden />;
}
