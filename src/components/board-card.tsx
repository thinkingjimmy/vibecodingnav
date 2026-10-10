/**
 * [INPUT]: 依赖场景卡片数据与厂商标
 * [OUTPUT]: 对外提供首页和场景列表共用的榜单卡片，模型名链到模型页
 * [POS]: src/components 的场景榜单卡片
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import type { VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

export interface BoardCardRow {
  rank: number;
  name: string;
  vendor: VendorId;
  href: string;
  reason?: string;
  score?: string;
  unit?: string;
  license?: string;
}

export interface BoardCardData {
  href: string;
  title: string;
  sourceName: string;
  sourceHref?: string;
  asOf: string;
  rows: BoardCardRow[];
}

export function BoardCard({ card, viewMore }: { card: BoardCardData; viewMore: string }) {
  return (
    <article className="card">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={card.href} className="text-[16px] font-medium tracking-[-0.01em] hover:text-fg">{card.title}</Link>
          <Link href={card.href} className="num shrink-0 pt-0.5 text-[12px] text-mfg hover:text-fg">{viewMore} →</Link>
        </div>
        <div className="num mt-1 text-[11px] text-faint">
          {card.sourceHref ? <Link href={card.sourceHref} className="link-u hover:text-fg">{card.sourceName}</Link> : card.sourceName}
          {card.asOf ? ` · ${card.asOf}` : ""}
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        {card.rows.map((row, index) => (
          <div key={row.name} className={`flex h-9 items-center gap-2.5 text-[13.5px] ${index ? "border-t border-line" : ""}`}>
            <span className="num w-3 text-[11px] text-faint">{row.rank}</span>
            <Link href={row.href} className="-mx-1 flex h-full min-w-0 cursor-pointer items-center gap-2.5 rounded px-1 no-underline hover:bg-muted">
              <VendorMark vendor={row.vendor} />
              <span className={`truncate ${index ? "" : "font-medium"}`}>{row.name}</span>
            </Link>
            {row.license ? <span className="num text-[10.5px] text-faint">{row.license}</span> : null}
            {row.reason ? <span className="ml-auto text-[12px] whitespace-nowrap text-mfg">{row.reason}</span> : (
              <span className={`num ml-auto ${index ? "text-mfg" : ""}`}>
                {row.score ?? ""}
                {row.unit ? <span className="text-[11px] text-faint">{row.unit}</span> : null}
              </span>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
