/**
 * [INPUT]: 依赖场景卡片数据、厂商标与 Base UI Tooltip
 * [OUTPUT]: 对外提供首页和场景列表共用的榜单卡片：名次、厂商标、模型名、综合分；悬停 / 键盘聚焦看各榜
 * [POS]: src/components 的场景榜单卡片
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import Link from "next/link";
import type { VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

export interface BoardCardDetail {
  title: string;
  boards: { label: string; value: string }[];
}

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
  detail?: BoardCardDetail;
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

const rowHover = "hover:bg-[color-mix(in_oklab,var(--muted)_60%,transparent)] data-popup-open:bg-[color-mix(in_oklab,var(--muted)_60%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--muted)_60%,transparent)]";

export function BoardCard({ card, viewMore }: { card: BoardCardData; viewMore: string }) {
  return (
    <article className="card">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={card.href} className="text-[16px] font-medium tracking-[-0.01em] hover:text-fg">{card.title}</Link>
          <Link href={card.href} className="num shrink-0 pt-0.5 text-[12px] text-mfg hover:text-fg">{viewMore} →</Link>
        </div>
      </div>
      <Tooltip.Provider>
        <div className="flex-1 px-4 pb-2.5">
          {card.rows.map((row, index) => (
            <CardRow key={row.name} row={row} index={index} />
          ))}
        </div>
      </Tooltip.Provider>
    </article>
  );
}

function CardRow({ row, index }: { row: BoardCardRow; index: number }) {
  const content = (
    <>
      <span className="num w-3.5 shrink-0 text-[11px] text-faint">{row.rankLabel ?? row.rank}</span>
      {row.href ? (
        <Link href={row.href} className="flex min-w-0 cursor-pointer items-center gap-2.5 no-underline">
          <VendorMark vendor={row.vendor} letter={row.letter} />
          <span className={`truncate ${index ? "" : "font-medium"}`}>{row.name}</span>
        </Link>
      ) : (
        <span className="flex min-w-0 items-center gap-2.5">
          <VendorMark vendor={row.vendor} letter={row.letter} />
          <span className="truncate">{row.name}</span>
        </span>
      )}
      {row.license ? <span className="num text-[10.5px] text-faint">{row.license}</span> : null}
      {row.reason ? (
        <span className="ml-auto text-[12px] whitespace-nowrap text-mfg">{row.reason}</span>
      ) : (
        <span className={`num ml-auto ${index ? "text-mfg" : ""}`}>
          {row.score ?? ""}
          {row.unit ? <span className="text-[11px] text-faint">{row.unit}</span> : null}
        </span>
      )}
    </>
  );

  if (!row.detail) {
    return (
      <div className={`flex h-[38px] items-center gap-2.5 text-[13.5px] ${index ? "border-t border-line" : ""}`}>
        {content}
      </div>
    );
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        delay={200}
        render={(props) => (
          <div
            {...props}
            tabIndex={0}
            className={`-mx-2 flex h-[38px] w-[calc(100%+1rem)] items-center gap-2.5 rounded-md px-2 text-[13.5px] outline-none ${rowHover} ${index ? "border-t border-line" : ""}`}
            aria-label={`${row.name}, ${row.detail!.title}`}
          >
            {content}
          </div>
        )}
      />
      <Tooltip.Portal>
        <Tooltip.Positioner side="right" align="start" sideOffset={8} className="z-50">
          <Tooltip.Popup className="w-[236px] rounded-lg border border-bd bg-bg px-3 py-2.5 text-[12px] text-fg shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] outline-none">
            <div className="mb-1 font-medium">{row.detail.title}</div>
            {row.detail.boards.map((board) => (
              <div key={board.label} className="flex justify-between gap-3 py-0.5">
                <span className="text-mfg">{board.label}</span>
                <span className="num shrink-0">{board.value}</span>
              </div>
            ))}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
