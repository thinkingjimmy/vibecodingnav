/**
 * [INPUT]: 依赖分类条目与类型文案
 * [OUTPUT]: 对外提供按类型筛选的工具列表
 * [POS]: src/components 的工具分类交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary, ItemType } from "@/lib/contracts";

interface Row {
  href: string;
  name: string;
  type: ItemType;
  typeLabel: string;
  oneLiner: string;
  fitFor: string;
  meta: string;
}

export function CategoryList({ rows, dict }: { rows: Row[]; dict: Dictionary }) {
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const types = (["library", "skill", "plugin", "prompt", "tool"] as const).filter((type) => rows.some((row) => row.type === type));
  const visible = filter === "all" ? rows : rows.filter((row) => row.type === filter);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 px-4 pb-4 text-[13px]">
        {filter === "all" ? <span className="pill">{dict.scenario.filterAll}</span> : <button type="button" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => setFilter("all")}>{dict.scenario.filterAll}</button>}
        {types.map((type) => filter === type ? <span key={type} className="pill">{dict.type[type]}</span> : (
          <button key={type} type="button" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => setFilter(type)}>{dict.type[type]}</button>
        ))}
      </div>
      <div className="mx-4 border-t border-line">
        {visible.length === 0 ? <p className="py-6 text-[14px] text-mfg">{dict.tools.empty}</p> : null}
        {visible.map((row) => (
          <Link key={row.href} href={row.href} className="rowh grid gap-2 border-b border-line py-4 md:grid-cols-[220px_1fr_210px] md:gap-6">
            <span className="flex items-center gap-2"><span className="text-[15px] font-medium">{row.name}</span><span className="tag">{row.typeLabel}</span></span>
            <span>
              <span className="block text-[14.5px] leading-relaxed">{row.oneLiner}</span>
              <span className="mt-1 block text-[13px] text-mfg">{dict.tools.fit}：{row.fitFor}</span>
            </span>
            <span className="num pt-1 text-[11.5px] text-faint md:text-right">{row.meta}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
