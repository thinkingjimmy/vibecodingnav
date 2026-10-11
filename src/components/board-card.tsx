/**
 * [INPUT]: 依赖场景卡片数据与厂商标
 * [OUTPUT]: 对外提供首页和场景列表共用的榜单卡片，标题下不列基准名，模型名链到模型页
 * [POS]: src/components 的场景榜单卡片
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import type { VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

export interface BoardCardRow {
  rank: number;
  rankLabel?: string;
  name: string;
  vendor?: VendorId;
  letter?: string;
  href?: string;
  reason?: string;
  score?: string;
  unit?: string;
  boards?: string;
  boardsTitle?: string;
  license?: string;
}

export interface BoardCardData {
  href: string;
  title: string;
  sourceName?: string;
  sourceHref?: string;
  sources?: { name: string; href: string }[];
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
      </div>
      <div className="flex-1 px-4 pb-4">
        {card.rows.map((row, index) => (
          <div key={row.name} className={`flex h-9 items-center gap-2.5 text-[13.5px] ${index ? "border-t border-line" : ""}`}>
            <span className="num w-7 shrink-0 text-[11px] text-faint">{row.rankLabel ?? row.rank}</span>
            {row.href ? (
              <Link href={row.href} className="flex min-w-0 cursor-pointer items-center gap-2.5 no-underline">
                <VendorMark vendor={row.vendor} letter={row.letter} />
                <span className={`truncate ${index ? "" : "font-medium"}`}>{row.name}</span>
              </Link>
            ) : <span className="flex min-w-0 items-center gap-2.5"><VendorMark vendor={row.vendor} letter={row.letter} /><span className="truncate">{row.name}</span></span>}
            {row.license ? <span className="num text-[10.5px] text-faint">{row.license}</span> : null}
            {row.reason ? <span className="ml-auto text-[12px] whitespace-nowrap text-mfg">{row.reason}</span> : row.boards ? (
              <span className="num ml-auto whitespace-nowrap text-[12px] text-mfg" title={row.boardsTitle}>{row.boards}</span>
            ) : (
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
