/**
 * [INPUT]: Scenario fusion data, localized UI text, and the sync label.
 * [OUTPUT]: ScenarioComparison with rank-chart and full-table views.
 * [POS]: Web frontend comparison entry point, composed by ScenarioView.
 * [PROTOCOL]: Update this header when making changes, then check README.md.
 */
"use client";

import { ChartLine, Table } from "@phosphor-icons/react";
import { useState } from "react";
import type { Dictionary } from "@/lib/contracts";
import { FusedTable } from "../fused-table";
import { RankChart } from "./rank-chart";
import type { Fusion } from "./rank-layout";

export function ScenarioComparison({ fusion, dict, syncLabel }: { fusion: Fusion; dict: Dictionary; syncLabel: string }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const copy = dict.scenario;

  return (
    <div data-scenario-comparison>
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 pb-5">
        <h2 className="font-[Georgia,'Times_New_Roman',serif] text-[28px] leading-tight tracking-[-0.025em]">{copy.comparisonTitle}</h2>
        <div role="group" aria-label={copy.comparisonView} className="inline-flex gap-0.5 rounded-lg border border-bd p-0.5 text-[12px]">
          {([
            { value: "chart", label: copy.comparisonChart, Icon: ChartLine },
            { value: "table", label: copy.comparisonTable, Icon: Table },
          ] as const).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => setView(value)}
              className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md px-3 ${view === value ? "bg-muted font-medium text-fg" : "text-mfg hover:text-fg"}`}
            >
              <Icon size={15} aria-hidden />
              {label}
            </button>
          ))}
        </div>
      </header>
      {view === "chart" ? <RankChart fusion={fusion} dict={dict} syncLabel={syncLabel} /> : <FusedTable fusion={fusion} dict={dict} syncLabel={syncLabel} />}
    </div>
  );
}
