/**
 * [INPUT]: 依赖场景标题、一句论点、同步日期、推荐组合与评分抽屉数据
 * [OUTPUT]: 对外提供场景页头部：标题 + 一句说明、同步、组合链接、「评分方法」抽屉
 * [POS]: src/components 的场景页头部
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import Link from "next/link";
import type { Dictionary } from "@/lib/contracts";
import { ScenarioScoringDrawer, type ScenarioScoring } from "./scenario-scoring-drawer";

export function ScenarioHero({
  title,
  thesis,
  sync,
  combo,
  scoring,
  dict,
  stale,
}: {
  title: string;
  thesis: string;
  sync: string;
  combo?: { href: string; label: string };
  scoring: ScenarioScoring;
  dict: Dictionary;
  stale?: boolean;
}) {
  return (
    <section className="px-4 pt-6">
      <div className="flex items-end justify-between gap-8">
        <div className="min-w-0">
          <h1 className="display-page">{title}</h1>
          <p className="mt-3.5 max-w-[680px] text-[17px] leading-relaxed text-mfg">{thesis}</p>
        </div>
        <div className="pb-1">
          <ScenarioScoringDrawer dict={dict} scoring={scoring} />
        </div>
      </div>
      <p className="num mt-4 text-[12px] text-faint">{sync}</p>
      {combo ? (
        <p className="mt-3 text-[14px]">
          <Link href={combo.href} className="link-u">
            {dict.scenario.combo}：{combo.label}
          </Link>
        </p>
      ) : null}
      {stale ? <p className="mt-4 text-[14px] text-mfg" data-stale="true">{dict.scenario.staleBanner}</p> : null}
    </section>
  );
}
