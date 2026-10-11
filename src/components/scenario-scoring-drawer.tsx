/**
 * [INPUT]: 依赖 Base UI Dialog、场景评分说明与小多图示例数据
 * [OUTPUT]: 对外提供「评分方法」右侧抽屉：归一化、权重、缺榜公式、注意与可选小多图
 * [POS]: src/components 的场景页评分说明
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Dictionary, VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

export interface ScoringExampleModel {
  key: string;
  name: string;
  vendor?: VendorId;
  letter?: string;
  rank: number;
  score: string;
  bars: (number | null)[];
  highlight: number;
}

export interface ScoringExample {
  caption: string;
  dimensions: string[];
  models: ScoringExampleModel[];
}

export interface ScenarioScoring {
  weights: { name: string; weight: string }[];
  caveats: string[];
  example?: ScoringExample;
}

function barHeight(value: number | null) {
  if (value == null) return 6;
  return Math.max(4, ((value - 40) / 60) * 100);
}

export function ScenarioScoringDrawer({
  dict,
  scoring,
}: {
  dict: Dictionary;
  scoring: ScenarioScoring;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-[7px] bg-muted px-[11px] text-[13px] font-medium text-fg hover:bg-muted/80">
        {dict.scenario.scoringMethod}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-fg/[0.06]" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-[min(460px,100vw)] flex-col border-l border-bd bg-bg shadow-[-24px_0_48px_-32px_rgba(0,0,0,0.3)] outline-none dark:shadow-[-24px_0_48px_-32px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between gap-4 px-7 pt-7">
            <Dialog.Title className="text-[20px] font-medium tracking-[-0.02em]">{dict.scenario.scoringTitle}</Dialog.Title>
            <Dialog.Close className="num shrink-0 text-[12px] text-faint hover:text-fg">
              {dict.scenario.scoringClose} ✕
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{dict.scenario.scoringIntro}</Dialog.Description>
          <div className="flex-1 overflow-y-auto px-7 pt-3 pb-10">
            {scoring.example ? <Multiples example={scoring.example} legend={dict.scenario.scoringExampleLegend} /> : null}
            <p className="mt-4 text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringIntro}</p>
            <section className="mt-6">
              <h3 className="num mb-2 text-[12px] font-medium text-faint">{dict.scenario.scoringNormalizeTitle}</h3>
              <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringNormalizeBody}</p>
            </section>
            <section className="mt-6">
              <h3 className="num mb-2 text-[12px] font-medium text-faint">{dict.scenario.scoringWeightsTitle}</h3>
              <p className="mb-2 text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringWeightsBody}</p>
              <div className="text-[13.5px]">
                {scoring.weights.map((row, index) => (
                  <div key={row.name} className={`grid grid-cols-[1fr_auto] gap-3 py-1.5 ${index ? "border-t border-line" : ""}`}>
                    <span>{row.name}</span>
                    <span className="num text-right">{row.weight}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-6">
              <h3 className="num mb-2 text-[12px] font-medium text-faint">{dict.scenario.scoringMissingTitle}</h3>
              <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringMissingBody}</p>
              <div className="num mt-2 rounded-lg bg-surface px-3 py-2.5 text-[12px] leading-relaxed text-fg shadow-[inset_0_0_0_1px_var(--line)]">
                {dict.scenario.scoringFormula}
              </div>
            </section>
            {scoring.caveats.length ? (
              <section className="mt-6">
                <h3 className="num mb-2 text-[12px] font-medium text-faint">{dict.scenario.scoringCaveatsTitle}</h3>
                <ul className="space-y-1">
                  {scoring.caveats.map((caveat) => (
                    <li key={caveat} className="relative pl-3.5 text-[13.5px] leading-relaxed text-mfg before:absolute before:top-[0.75em] before:left-0.5 before:h-px before:w-1 before:bg-faint">
                      {caveat}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Multiples({ example, legend }: { example: ScoringExample; legend: string }) {
  return (
    <div className="rounded-[10px] border border-bd p-3.5">
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {example.models.map((model) => (
          <div key={model.key} className={model.highlight >= 0 ? "" : "opacity-90"}>
            <div className="flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap">
              <VendorMark vendor={model.vendor} letter={model.letter} />
              <span className="truncate">{model.name}</span>
            </div>
            <div className="mt-2.5 flex h-14 items-end gap-1 border-b border-bd">
              {model.bars.map((value, index) => {
                const missing = value == null;
                const emphasized = model.highlight === index;
                return (
                  <i
                    key={`${model.key}-${index}`}
                    className={
                      missing
                        ? "flex-1 opacity-70 [background:repeating-linear-gradient(135deg,var(--faint)_0_1px,transparent_1px_3px)]"
                        : emphasized
                          ? "flex-1 rounded-t-[1px] bg-fg"
                          : model.highlight >= 0
                            ? "flex-1 rounded-t-[1px] bg-bd"
                            : "flex-1 rounded-t-[1px] bg-fg"
                    }
                    style={{ height: `${barHeight(value)}%` }}
                    aria-hidden
                  />
                );
              })}
            </div>
            <div className="num mt-1.5 flex justify-between text-[11px] text-faint">
              <span>#{model.rank}</span>
              <b className="text-[14px] font-medium text-fg">{model.score}</b>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-mfg">{example.caption}</p>
      <p className="num mt-1 text-[11px] text-faint">
        {example.dimensions.join(" · ")} · {legend}
      </p>
    </div>
  );
}
