/**
 * [INPUT]: 依赖场景标题、介绍句、融合表 takeaway 与评分模态数据
 * [OUTPUT]: 对外提供场景页头部：标题、介绍、数据 takeaway，以及行内「怎么算的？」评分入口
 * [POS]: src/components 的场景页头部
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import type { Dictionary, VendorId } from "@/lib/contracts";
import { ScenarioScoringModal, type ScenarioScoring } from "./scenario-scoring-modal";
import { VendorMark } from "./vendor-mark";

export function ScenarioHero({
  title,
  thesis,
  takeaway,
  scoring,
  dict,
  stale,
}: {
  title: string;
  thesis: string;
  takeaway?: {
    name: string;
    vendor?: VendorId;
    letter?: string;
    body: string;
    sentence: string;
  };
  scoring: ScenarioScoring;
  dict: Dictionary;
  stale?: boolean;
}) {
  return (
    <section className="px-4 pt-6">
      <h1 className="display-page">{title}</h1>
      <p className="mt-4 max-w-[720px] text-[17px] leading-relaxed text-mfg">{thesis}</p>
      {takeaway ? (
        <p className="mt-1.5 max-w-[720px] text-[17px] leading-relaxed text-fg">
          <span>{dict.scenario.takeawayPrefix} </span>
          <span className="mx-0.5 inline-flex items-center gap-1.5 align-baseline font-medium">
            <VendorMark vendor={takeaway.vendor} letter={takeaway.letter} className="size-3.5 translate-y-px" />
            {takeaway.name}
          </span>{" "}
          <span>{takeaway.body}</span>
          <ScenarioScoringModal
            dict={dict}
            scoring={scoring}
            triggerClassName="link-u ml-1.5 text-[17px] font-normal text-mfg hover:text-fg"
            triggerLabel={dict.scenario.howScored}
          />
        </p>
      ) : (
        <div className="mt-1.5">
          <ScenarioScoringModal
            dict={dict}
            scoring={scoring}
            triggerClassName="link-u text-[17px] font-normal text-mfg hover:text-fg"
            triggerLabel={dict.scenario.howScored}
          />
        </div>
      )}
      {stale ? <p className="mt-4 text-[14px] text-mfg" data-stale="true">{dict.scenario.staleBanner}</p> : null}
    </section>
  );
}
