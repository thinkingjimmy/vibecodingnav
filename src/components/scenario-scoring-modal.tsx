/**
 * [INPUT]: 依赖 Base UI Dialog、场景评分说明与小多图示例数据
 * [OUTPUT]: 对外提供「评分方法」居中模态：左侧目录 + 右侧可滚动内容（小多图、归一化、权重、缺榜公式、注意）
 * [POS]: src/components 的场景页评分说明
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useId, useRef, useState } from "react";
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

type TocSection = { id: string; title: string };

function restoreFocusQuietly(node: HTMLElement | null) {
  if (!node) return;
  node.dataset.restoreFocus = "";
  node.focus({ preventScroll: true, focusVisible: false });
  const clear = () => {
    delete node.dataset.restoreFocus;
    node.removeEventListener("blur", clear);
  };
  node.addEventListener("blur", clear);
}

function barHeight(value: number | null) {
  if (value == null) return 6;
  return Math.max(4, ((value - 40) / 60) * 100);
}

export function ScenarioScoringModal({
  dict,
  scoring,
}: {
  dict: Dictionary;
  scoring: ScenarioScoring;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  const hasCaveats = scoring.caveats.length > 0;
  const whyId = `${baseId}-why`;
  const normalizeId = `${baseId}-normalize`;
  const weightsId = `${baseId}-weights`;
  const missingId = `${baseId}-missing`;
  const caveatsId = `${baseId}-caveats`;
  const sections: TocSection[] = [
    { id: whyId, title: dict.scenario.scoringWhyTitle },
    { id: normalizeId, title: dict.scenario.scoringNormalizeTitle },
    { id: weightsId, title: dict.scenario.scoringWeightsTitle },
    { id: missingId, title: dict.scenario.scoringMissingTitle },
    ...(hasCaveats ? [{ id: caveatsId, title: dict.scenario.scoringCaveatsTitle }] : []),
  ];

  useEffect(() => {
    if (!open) return;
    const root = contentRef.current;
    if (!root) return;
    const ids = [
      whyId,
      normalizeId,
      weightsId,
      missingId,
      ...(hasCaveats ? [caveatsId] : []),
    ];

    const syncActive = () => {
      const scrollTop = root.scrollTop;
      let next = ids[0] ?? "";
      for (const id of ids) {
        const el = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
        if (!el) continue;
        if (el.offsetTop - 28 <= scrollTop) next = id;
      }
      setActiveId(next);
    };

    root.addEventListener("scroll", syncActive, { passive: true });
    return () => root.removeEventListener("scroll", syncActive);
  }, [open, whyId, normalizeId, weightsId, missingId, caveatsId, hasCaveats]);

  const scrollToSection = (id: string) => {
    const root = contentRef.current;
    const el = root?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!root || !el) return;
    root.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setActiveId(whyId);
      }}
    >
      <Dialog.Trigger
        ref={triggerRef}
        className="inline-flex h-[30px] shrink-0 items-center gap-1.5 rounded-[7px] bg-muted px-[11px] text-[13px] font-medium text-fg hover:bg-muted/80"
      >
        {dict.scenario.scoringMethod}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-fg/[0.12] dark:bg-fg/[0.28]" />
        <Dialog.Popup
          finalFocus={() => {
            restoreFocusQuietly(triggerRef.current);
            return false;
          }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[80vh] w-[min(880px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[14px] border border-bd bg-bg shadow-[0_24px_64px_-28px_rgba(0,0,0,0.35)] outline-none dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.65)]"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <Dialog.Title className="text-[18px] font-medium tracking-[-0.02em] sm:text-[20px]">
              {dict.scenario.scoringTitle}
            </Dialog.Title>
            <Dialog.Close className="num shrink-0 text-[12px] text-faint hover:text-fg">
              {dict.scenario.scoringClose} ✕
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{dict.scenario.scoringIntro}</Dialog.Description>
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <nav
              aria-label={dict.scenario.scoringToc}
              className="shrink-0 border-b border-line md:w-[188px] md:border-r md:border-b-0"
            >
              <ul className="flex gap-1 overflow-x-auto px-3 py-2.5 md:flex-col md:gap-0.5 md:overflow-visible md:px-3 md:py-4">
                {sections.map((section) => {
                  const active = activeId === section.id;
                  return (
                    <li key={section.id} className="shrink-0">
                      <button
                        type="button"
                        aria-current={active ? "true" : undefined}
                        onClick={() => scrollToSection(section.id)}
                        className={
                          active
                            ? "block w-full rounded-[7px] bg-muted px-2.5 py-1.5 text-left text-[13px] font-medium text-fg whitespace-nowrap md:whitespace-normal"
                            : "block w-full rounded-[7px] px-2.5 py-1.5 text-left text-[13px] text-mfg whitespace-nowrap hover:bg-muted/60 hover:text-fg md:whitespace-normal"
                        }
                      >
                        {section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
              {scoring.example ? (
                <Multiples example={scoring.example} legend={dict.scenario.scoringExampleLegend} />
              ) : null}
              <section id={whyId} className={scoring.example ? "mt-5 scroll-mt-3" : "scroll-mt-3"}>
                <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringWhyTitle}</h3>
                <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringIntro}</p>
              </section>
              <section id={normalizeId} className="mt-6 scroll-mt-3">
                <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringNormalizeTitle}</h3>
                <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringNormalizeBody}</p>
              </section>
              <section id={weightsId} className="mt-6 scroll-mt-3">
                <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringWeightsTitle}</h3>
                <p className="mb-2 text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringWeightsBody}</p>
                <div className="text-[13.5px]">
                  {scoring.weights.map((row, index) => (
                    <div
                      key={row.name}
                      className={`grid grid-cols-[1fr_auto] gap-3 py-1.5 ${index ? "border-t border-line" : ""}`}
                    >
                      <span>{row.name}</span>
                      <span className="num text-right">{row.weight}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section id={missingId} className="mt-6 scroll-mt-3">
                <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringMissingTitle}</h3>
                <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringMissingBody}</p>
                <div className="num mt-2 rounded-lg bg-surface px-3 py-2.5 text-[12px] leading-relaxed text-fg shadow-[inset_0_0_0_1px_var(--line)]">
                  {dict.scenario.scoringFormula}
                </div>
              </section>
              {hasCaveats ? (
                <section id={caveatsId} className="mt-6 scroll-mt-3 pb-2">
                  <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringCaveatsTitle}</h3>
                  <ul className="space-y-1">
                    {scoring.caveats.map((caveat) => (
                      <li
                        key={caveat}
                        className="relative pl-3.5 text-[13.5px] leading-relaxed text-mfg before:absolute before:top-[0.75em] before:left-0.5 before:h-px before:w-1 before:bg-faint"
                      >
                        {caveat}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
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
