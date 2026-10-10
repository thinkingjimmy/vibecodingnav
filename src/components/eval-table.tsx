/**
 * [INPUT]: 依赖 catalog 算出的框架评测行与字典
 * [OUTPUT]: 对外提供基线榜与逐模型变化量，两列分数不相加
 * [POS]: src/components 的评测表，条目页和基准页共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { VendorMark } from "@/components/vendor-mark";
import type { VendorId } from "@/lib/contracts";
import type { getDictionary } from "@/lib/i18n";

type Dict = ReturnType<typeof getDictionary>;

export interface EvalTableRow {
  rank?: number;
  name: string;
  vendor: VendorId;
  href: string;
  setting?: string;
  baseline: string;
  assisted?: string;
  web?: string;
  delta?: string;
  cost?: string;
}

export function EvalTable({
  rows,
  dict,
  mode,
  assistedLabel,
  webLabel,
  showWeb,
}: {
  rows: EvalTableRow[];
  dict: Dict;
  mode: "board" | "uplift" | "unverified";
  assistedLabel: string;
  webLabel: string;
  showWeb: boolean;
}) {
  if (mode === "unverified" || rows.length === 0) return null;
  const uplift = mode === "uplift";
  const showCost = !uplift && rows.some((row) => row.cost);
  return (
    <div className="overflow-x-auto border-y border-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="num text-[11px] text-faint">
            <th className="px-4 py-2 font-normal">#</th>
            <th className="px-4 py-2 font-normal">{dict.scenario.colModel}</th>
            <th className="px-4 py-2 text-right font-normal">{dict.item.evalBaseline}</th>
            {uplift ? <th className="px-4 py-2 text-right font-normal">{assistedLabel}</th> : null}
            {uplift ? <th className="px-4 py-2 text-right font-normal">{dict.item.evalDelta}</th> : null}
            {showWeb ? <th className="px-4 py-2 text-right font-normal">{webLabel}</th> : null}
            {showCost ? <th className="px-4 py-2 text-right font-normal">{dict.item.evalCost}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.href}-${row.setting ?? ""}-${row.rank ?? ""}`} className="border-t border-line">
              <td className="num px-4 py-3 text-mfg">{row.rank ?? "—"}</td>
              <td className="px-4 py-3">
                <Link href={row.href} className="inline-flex items-center gap-2 font-medium link-u">
                  <VendorMark vendor={row.vendor} />
                  {row.name}
                </Link>
                {row.setting ? <div className="num mt-1 text-[11px] text-faint">{row.setting}</div> : null}
              </td>
              <td className="num px-4 py-3 text-right">{row.baseline}</td>
              {uplift ? <td className="num px-4 py-3 text-right">{row.assisted}</td> : null}
              {uplift ? <td className="num px-4 py-3 text-right">{row.delta}</td> : null}
              {showWeb ? <td className="num px-4 py-3 text-right text-mfg">{row.web ?? "—"}</td> : null}
              {showCost ? <td className="num px-4 py-3 text-right text-mfg">{row.cost ?? "—"}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
