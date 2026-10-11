/**
 * [INPUT]: 依赖 Base UI Dialog、场景评分说明、逐步拆解与（可选）小多图数据
 * [OUTPUT]: 对外提供「评分方法」居中模态：目录 + 公式 / 例子 / 为什么合起来看 / 权重 / 缺榜 / 注意；右上角仅 X 关闭
 * [POS]: src/components 的场景页评分说明
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useEffect, useId, useRef, useState } from "react";
import type { Dictionary, VendorId } from "@/lib/contracts";
import { DialogCloseButton } from "./ui/dialog-close";
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

export interface ScoringWorkedRow {
  board: string;
  name: string;
  raw: string;
  normalizedLabel: string;
  weightLabel: string;
  contributionLabel: string;
  normalized: number;
  weight: number;
  contribution: number;
  missing: boolean;
  preliminary: boolean;
  halfWeight: boolean;
}

export interface ScoringWorkedExample {
  key: string;
  name: string;
  vendor?: VendorId;
  letter?: string;
  composite: number;
  compositeLabel: string;
  numerator: number;
  denominator: number;
  score: number;
  numeratorLabel: string;
  denominatorLabel: string;
  exactLabel: string;
  lead: string;
  rows: ScoringWorkedRow[];
}

export interface ScenarioScoring {
  weights: { name: string; weight: string }[];
  caveats: string[];
  worked?: ScoringWorkedExample;
  chart?: ScoringExample;
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

function MathVar({ children, sub }: { children: string; sub?: string }) {
  return (
    <var className="not-italic font-[ui-serif,Georgia,Cambria,Times,serif] text-fg">
      {children}
      {sub ? <sub className="text-[0.75em]">{sub}</sub> : null}
    </var>
  );
}

function FormulaBlock({ dict }: { dict: Dictionary }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[10px] bg-surface px-3.5 py-3 shadow-[inset_0_0_0_1px_var(--line)]">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[15px] leading-none text-fg sm:text-[16px]">
          <span className="font-[ui-serif,Georgia,Cambria,Times,serif]">composite</span>
          <span className="text-faint">=</span>
          <span className="inline-flex flex-col items-center font-[ui-serif,Georgia,Cambria,Times,serif]">
            <span className="border-b border-fg/55 px-1.5 pb-1">
              Σ(<MathVar sub="b">w</MathVar>·<MathVar sub="b">s</MathVar>)
            </span>
            <span className="px-1.5 pt-1">Σ<MathVar sub="b">w</MathVar></span>
          </span>
          <span className="text-[12.5px] text-mfg sm:text-[13px]">→ round</span>
        </div>
        <p className="mt-2.5 text-center text-[12.5px] leading-snug text-mfg">{dict.scenario.scoringCompositePlain}</p>
      </div>

      <div className="space-y-3 text-[13.5px] leading-relaxed">
        <div>
          <div className="font-[ui-serif,Georgia,Cambria,Times,serif] text-[14px] text-fg">
            <MathVar sub="b">s</MathVar>
            <span className="mx-1.5 text-faint">·</span>
            <span className="font-sans text-[13px] text-mfg">{dict.scenario.scoringSbPlain}</span>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg bg-surface px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--line)]">
              <div className="font-[ui-serif,Georgia,Cambria,Times,serif] text-[13.5px] leading-snug">
                <MathVar sub="b">s</MathVar>
                <span className="mx-1 text-faint">=</span>
                <span className="inline-flex flex-col items-center align-middle">
                  <span className="border-b border-fg/45 px-1 pb-0.5">200</span>
                  <span className="px-1 pt-0.5 text-[12px]">
                    1+10<sup className="text-[10px]">(L−x)/400</sup>
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-snug text-mfg">{dict.scenario.scoringArenaPlain}</p>
            </div>
            <div className="rounded-lg bg-surface px-3 py-2.5 shadow-[inset_0_0_0_1px_var(--line)]">
              <div className="font-[ui-serif,Georgia,Cambria,Times,serif] text-[13.5px] leading-snug">
                <MathVar sub="b">s</MathVar>
                <span className="mx-1 text-faint">=</span>
                100 ×
                <span className="mx-0.5 inline-flex flex-col items-center align-middle">
                  <span className="border-b border-fg/45 px-1.5 pb-0.5">x</span>
                  <span className="px-1.5 pt-0.5">L</span>
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-snug text-mfg">{dict.scenario.scoringRatePlain}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="font-[ui-serif,Georgia,Cambria,Times,serif] text-[14px] text-fg">
            <MathVar sub="b">w</MathVar>
            <span className="mx-1.5 text-faint">·</span>
            <span className="font-sans text-[13px] text-mfg">{dict.scenario.scoringWbPlain}</span>
          </div>
        </div>

        <div>
          <div className="font-[ui-serif,Georgia,Cambria,Times,serif] text-[14px] text-fg">
            missing
            <span className="mx-1.5 text-faint">·</span>
            <span className="font-sans text-[13px] text-mfg">{dict.scenario.scoringMissingTermPlain}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkedExample({
  dict,
  worked,
}: {
  dict: Dictionary;
  worked: ScoringWorkedExample;
}) {
  const sum = dict.scenario.scoringExampleSum
    .replace("{num}", worked.numeratorLabel)
    .replace("{den}", worked.denominatorLabel)
    .replace("{exact}", worked.exactLabel)
    .replace("{display}", worked.compositeLabel);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[13.5px] leading-relaxed text-mfg">
        <VendorMark vendor={worked.vendor} letter={worked.letter} />
        <p>{worked.lead}</p>
      </div>
      <div className="overflow-x-auto rounded-[10px] border border-bd">
        <table className="w-full min-w-[520px] border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-line text-[11.5px] text-faint">
              <th className="px-3 py-2 font-medium">{dict.scenario.scoringColBoard}</th>
              <th className="px-3 py-2 font-medium">{dict.scenario.scoringColRaw}</th>
              <th className="num px-3 py-2 text-right font-medium">{dict.scenario.scoringColNorm}</th>
              <th className="num px-3 py-2 text-right font-medium">{dict.scenario.scoringColWeight}</th>
              <th className="num px-3 py-2 text-right font-medium">{dict.scenario.scoringColContrib}</th>
            </tr>
          </thead>
          <tbody>
            {worked.rows.map((row) => (
              <tr key={row.name} className="border-b border-line last:border-b-0">
                <td className="px-3 py-2 align-top">
                  <div className="font-medium text-fg">{row.board}</div>
                  <div className="mt-0.5 text-[11px] text-faint">{row.name}</div>
                </td>
                <td className={`px-3 py-2 align-top ${row.missing ? "text-faint" : "text-mfg"}`}>{row.raw}</td>
                <td className="num px-3 py-2 text-right align-top tabular-nums">{row.normalizedLabel}</td>
                <td className="num px-3 py-2 text-right align-top tabular-nums">
                  {row.weightLabel}
                  {row.halfWeight ? (
                    <span className="ml-1 text-[10.5px] text-faint">{dict.scenario.scoringHalfWeightNote}</span>
                  ) : null}
                </td>
                <td className="num px-3 py-2 text-right align-top font-medium tabular-nums text-fg">
                  {row.contributionLabel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="num mt-2.5 text-[13px] text-fg">{sum}</p>
    </div>
  );
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
  const hasWorked = Boolean(scoring.worked);
  const hasChart = Boolean(scoring.chart);
  const formulaId = `${baseId}-formula`;
  const exampleId = `${baseId}-example`;
  const whyId = `${baseId}-why`;
  const weightsId = `${baseId}-weights`;
  const missingId = `${baseId}-missing`;
  const caveatsId = `${baseId}-caveats`;
  const sections: TocSection[] = [
    { id: formulaId, title: dict.scenario.scoringFormulaTitle },
    ...(hasWorked ? [{ id: exampleId, title: dict.scenario.scoringExampleTitle }] : []),
    { id: whyId, title: dict.scenario.scoringWhyTitle },
    { id: weightsId, title: dict.scenario.scoringWeightsTitle },
    { id: missingId, title: dict.scenario.scoringMissingTitle },
    ...(hasCaveats ? [{ id: caveatsId, title: dict.scenario.scoringCaveatsTitle }] : []),
  ];

  useEffect(() => {
    if (!open) return;
    const root = contentRef.current;
    if (!root) return;
    const ids = [
      formulaId,
      ...(hasWorked ? [exampleId] : []),
      whyId,
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
  }, [open, formulaId, exampleId, whyId, weightsId, missingId, caveatsId, hasWorked, hasCaveats]);

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
        if (next) setActiveId(formulaId);
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
            <DialogCloseButton label={dict.scenario.scoringClose} />
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
              <section id={formulaId} className="scroll-mt-3">
                <h3 className="mb-3 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringFormulaTitle}</h3>
                <FormulaBlock dict={dict} />
              </section>

              {scoring.worked ? (
                <section id={exampleId} className="mt-6 scroll-mt-3">
                  <h3 className="mb-3 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringExampleTitle}</h3>
                  <WorkedExample dict={dict} worked={scoring.worked} />
                </section>
              ) : null}

              <section id={whyId} className="mt-6 scroll-mt-3">
                <h3 className="mb-2 text-[14px] font-medium tracking-[-0.01em]">{dict.scenario.scoringWhyTitle}</h3>
                <p className="text-[13.5px] leading-relaxed text-mfg">{dict.scenario.scoringWhyBody}</p>
                {hasChart && scoring.chart ? (
                  <div className="mt-3">
                    <Multiples
                      example={scoring.chart}
                      legend={dict.scenario.scoringChartLegend}
                      captionMeta={dict.scenario.scoringChartCaptionMeta}
                    />
                  </div>
                ) : null}
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

function Multiples({
  example,
  legend,
  captionMeta,
}: {
  example: ScoringExample;
  legend: string;
  captionMeta: string;
}) {
  return (
    <div className="rounded-[10px] border border-bd p-3.5">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {example.models.map((model) => (
          <div key={model.key} className={model.highlight >= 0 ? "" : "opacity-90"}>
            <div className="flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap">
              <VendorMark vendor={model.vendor} letter={model.letter} />
              <span className="truncate">{model.name}</span>
            </div>
            <div className="mt-2.5 flex h-16 items-end gap-1 border-b border-bd">
              {model.bars.map((value, index) => {
                const missing = value == null;
                const emphasized = model.highlight === index;
                const height = missing ? 8 : Math.max(6, value);
                return (
                  <i
                    key={`${model.key}-${index}`}
                    title={`${example.dimensions[index] ?? ""}: ${missing ? "—" : value}`}
                    className={
                      missing
                        ? "flex-1 opacity-70 [background:repeating-linear-gradient(135deg,var(--faint)_0_1px,transparent_1px_3px)]"
                        : emphasized
                          ? "flex-1 rounded-t-[1px] bg-fg"
                          : model.highlight >= 0
                            ? "flex-1 rounded-t-[1px] bg-bd"
                            : "flex-1 rounded-t-[1px] bg-fg"
                    }
                    style={{ height: `${height}%` }}
                    aria-hidden
                  />
                );
              })}
            </div>
            <div
              className="mt-1 grid gap-1"
              style={{ gridTemplateColumns: `repeat(${example.dimensions.length}, minmax(0, 1fr))` }}
            >
              {example.dimensions.map((label) => (
                <span
                  key={`${model.key}-${label}`}
                  className="truncate text-center text-[9px] leading-tight text-faint"
                  title={label}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="num mt-1.5 flex justify-between text-[11px] text-faint">
              <span>#{model.rank}</span>
              <b className="text-[14px] font-medium text-fg">{model.score}</b>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12.5px] leading-snug text-mfg">{example.caption}</p>
      <p className="mt-1 text-[11.5px] leading-snug text-faint">{legend}</p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-faint">{captionMeta}</p>
    </div>
  );
}
