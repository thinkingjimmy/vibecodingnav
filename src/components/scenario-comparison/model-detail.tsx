/**
 * [INPUT]: A model row, benchmark columns, localized text, and a trigger button.
 * [OUTPUT]: ModelDetail, an anchored source-results popover with keyboard dismissal.
 * [POS]: RankChart model-label interaction; shares the chart's selected model state.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { Popover } from "@base-ui/react/popover";
import { ArrowRight, X } from "@phosphor-icons/react";
import Link from "next/link";
import type { ReactElement } from "react";
import type { Dictionary } from "@/lib/contracts";
import type { Fusion, FusionRow } from "./rank-layout";

export function ModelDetail({ row, columns, dict, open, onOpenChange, trigger }: {
  row: FusionRow;
  columns: Fusion["columns"];
  dict: Dictionary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactElement;
}) {
  const copy = dict.scenario;
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger render={trigger} />
      <Popover.Portal>
        <Popover.Positioner side="right" align="center" sideOffset={12} collisionPadding={16} collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "end" }} className="z-40">
          <Popover.Popup initialFocus={false} data-rank-detail className="w-[310px] max-w-[calc(100vw-32px)] rounded-xl border border-bd bg-bg p-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.22)] outline-none dark:shadow-black/50">
            <div className="flex items-start gap-3">
              <div>
                <Popover.Title className="text-[14px] font-semibold">{row.name}</Popover.Title>
                <Popover.Description className="mt-1 text-[12px] text-mfg">{copy.colComposite} <span className="font-medium text-fg">{row.compositeLabel}</span></Popover.Description>
              </div>
              <Popover.Close aria-label={copy.comparisonReset} className="-mr-1 -mt-1 ml-auto grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-mfg hover:bg-muted hover:text-fg"><X size={16} aria-hidden /></Popover.Close>
            </div>
            <p className="mt-3 text-[11px] text-mfg">{copy.comparisonSourceRank} / {copy.colScore}</p>
            <dl className="mb-3 mt-2 max-h-[45vh] overflow-y-auto border-y border-line py-2 text-[12px]">
              {columns.map((column, index) => {
                const cell = row.cells[index];
                return (
                  <div key={column.id} className="flex items-baseline justify-between gap-3 py-1.5">
                    <dt className="text-mfg">{column.shortLabel}</dt>
                    <dd className="shrink-0" title={cell?.tip}>
                      {cell ? <><span className="font-semibold" aria-label={`${copy.comparisonSourceRank} ${cell.rank}`}>#{cell.rank}</span><span className="ml-3 text-mfg">{cell.score}{cell.unit}</span></> : <span className="text-mfg">{copy.comparisonMissing}</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {row.href && <Link href={row.href} className="inline-flex min-h-7 items-center gap-1.5 text-[12px] text-mfg hover:text-fg">{copy.comparisonModelLink}<ArrowRight size={13} aria-hidden /></Link>}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
