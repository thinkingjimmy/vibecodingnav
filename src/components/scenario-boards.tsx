/**
 * [INPUT]: 依赖榜单表、页签文案与来源列
 * [OUTPUT]: 对外提供场景页的一张或多张来源榜，Android 用页签切换
 * [POS]: src/components 的场景榜单页签
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { useEffect, useState } from "react";
import type { BoardRow } from "@/lib/catalog";
import type { BoardTable, Dictionary, SourceFilter } from "@/lib/contracts";
import { Leaderboard } from "./leaderboard";

export interface ScenarioBoardPanel {
  id: string;
  label: string;
  name: string;
  asOf: string;
  table: BoardTable;
  filter: SourceFilter | "none";
  rows: BoardRow[];
}

export function ScenarioBoards({ boards, dict }: { boards: ScenarioBoardPanel[]; dict: Dictionary }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.replace("#", "");
      const index = boards.findIndex((board) => board.id === id);
      if (index >= 0) setActive(index);
    };
    window.addEventListener("hashchange", sync);
    // 哈希只在浏览器里。首屏先跟静态 HTML 一致，挂上后再打开对应页签。
    sync();
    return () => window.removeEventListener("hashchange", sync);
  }, [boards]);
  const board = boards[active];
  if (!board) return null;

  return (
    <section className="pt-16">
      <header className="px-4 pb-5">
        <h2 className="pt">{dict.scenario.board}</h2>
      </header>
      {boards.length > 1 ? (
        <div className="flex flex-wrap items-center gap-1 px-4 pb-4 text-[13px]" role="tablist">
          {boards.map((item, index) => index === active ? (
            <span key={item.id} className="pill" role="tab" aria-selected="true">{item.label}</span>
          ) : (
            <button key={item.id} type="button" role="tab" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => setActive(index)}>{item.label}</button>
          ))}
        </div>
      ) : null}
      <p className="num px-4 pb-4 text-[12px] text-faint">{board.name} · {board.asOf} · {board.rows.length}</p>
      <Leaderboard rows={board.rows} dict={dict} table={board.table} filter={board.filter} />
      {board.table === "webdev" ? <p className="num px-4 pt-5 text-[12px] text-faint">{dict.scenario.rankNote}</p> : null}
    </section>
  );
}
