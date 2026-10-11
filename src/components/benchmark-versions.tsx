/**
 * [INPUT]: 依赖版本化榜单、来源榜与字典
 * [OUTPUT]: 对外提供基准页的版本切换，默认当前版本，归档版本仍展示完整原榜
 * [POS]: src/components 的基准版本交互；查询参数和 hash 只在浏览器里读
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { useEffect, useState } from "react";
import type { VersionBoard } from "@/lib/catalog";
import type { Dictionary } from "@/lib/contracts";
import { Leaderboard } from "./leaderboard";

function matchVersion(versions: VersionBoard[], token: string | null) {
  if (!token) return undefined;
  return versions.find((version) => version.id === token || version.aliases.includes(token));
}

function versionFromLocation(versions: VersionBoard[]) {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("v") || window.location.hash.replace(/^#/, "");
  return matchVersion(versions, token);
}

export function BenchmarkVersions({ versions, dict }: { versions: VersionBoard[]; dict: Dictionary }) {
  const current = versions.find((version) => version.current) ?? versions[0]!;
  const [id, setId] = useState(current.id);
  const selected = versions.find((version) => version.id === id) ?? current;
  const rows = [
    [dict.benchmark.measures, selected.measures],
    [dict.benchmark.method, selected.method],
    [dict.benchmark.meaning, selected.scoreMeaning],
    [dict.benchmark.caveats, selected.caveats],
    [dict.benchmark.cadence, selected.updateCadence],
  ];

  useEffect(() => {
    const apply = () => {
      const found = versionFromLocation(versions);
      if (found) setId(found.id);
    };
    apply();
    window.addEventListener("hashchange", apply);
    window.addEventListener("popstate", apply);
    return () => {
      window.removeEventListener("hashchange", apply);
      window.removeEventListener("popstate", apply);
    };
  }, [versions]);

  function select(version: VersionBoard) {
    const url = new URL(window.location.href);
    url.searchParams.set("v", version.id);
    url.hash = "";
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    setId(version.id);
  }

  return (
    <>
      <div className="mx-4 mt-8 flex flex-wrap items-center gap-1 text-[13px]" data-version-switch>
        {versions.map((version) => version.id === selected.id ? (
          <span key={version.id} className="pill">{version.label}</span>
        ) : (
          <button key={version.id} type="button" className="grid h-7 place-items-center px-2.5 text-mfg hover:text-fg" onClick={() => select(version)}>{version.label}</button>
        ))}
      </div>
      {selected.archived ? <p className="mx-4 mt-3 text-[14px] text-mfg" data-archived="true">{dict.benchmark.archived} · {selected.asOf}</p> : null}
      <dl className="mx-4 mt-12 max-w-[820px]">
        {rows.map(([label, body], index) => (
          <div key={label} className={`grid gap-3 py-4 md:grid-cols-[120px_1fr] md:gap-6 ${index ? "border-t border-line" : ""}`}>
            <dt className="font-medium">{label}</dt>
            <dd className="leading-relaxed text-mfg">{body}</dd>
          </div>
        ))}
        <div className="grid gap-3 border-t border-line py-4 md:grid-cols-[120px_1fr] md:gap-6">
          <dt className="font-medium">{dict.benchmark.source}</dt>
          <dd className="space-y-1">{selected.links.map((link) => <a key={link.href} href={link.href} className="num block text-[13px] link-u">{link.label}</a>)}</dd>
        </div>
      </dl>
      {selected.leaderboard && selected.table ? (
        <section className="pt-16">
          <header className="px-4 pb-4">
            <h2 className="pt">{dict.scenario.board}</h2>
            <p className="num mt-2 text-[12px] text-faint">{selected.leaderboard.length}</p>
          </header>
          <Leaderboard key={selected.id} rows={selected.leaderboard} dict={dict} table={selected.table} filter={selected.filter} />
        </section>
      ) : null}
    </>
  );
}
