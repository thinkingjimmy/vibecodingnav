/**
 * [INPUT]: 依赖 Base UI Tooltip 与 design tokens
 * [OUTPUT]: 对外提供指针跟随的只读明细浮层（首页卡片、融合表格子）；含链接的列头用 ColumnInfoPopover
 * [POS]: src/components 的悬停明细 primitive
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

export interface ScoreBreakdownBoard {
  label: string;
  value: string;
}

export interface ScoreBreakdownContent {
  title?: string;
  boards?: ScoreBreakdownBoard[];
  children?: ReactNode;
}

const popupClass =
  "max-w-[300px] rounded-lg border border-bd bg-bg px-3 py-2.5 text-[12.5px] leading-snug text-mfg shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] outline-none dark:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]";

const OPEN_DELAY = 150;

export function ScoreBreakdownProvider({ children }: { children: ReactNode }) {
  return <Tooltip.Provider delay={OPEN_DELAY}>{children}</Tooltip.Provider>;
}

type TriggerRender = (props: Record<string, unknown>) => ReactElement;

export function ScoreBreakdown({
  content,
  label,
  render,
}: {
  content: ScoreBreakdownContent;
  label: string;
  render: TriggerRender;
}) {
  return (
    <Tooltip.Root trackCursorAxis="both" disableHoverablePopup={false}>
      <Tooltip.Trigger
        delay={OPEN_DELAY}
        closeOnClick={false}
        render={(props) => render({ ...props, tabIndex: 0, "aria-label": label })}
      />
      <Tooltip.Portal>
        <Tooltip.Positioner
          side="bottom"
          align="start"
          sideOffset={12}
          alignOffset={12}
          collisionPadding={8}
          collisionBoundary="clipping-ancestors"
          collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "end" }}
          className="z-50"
        >
          <Tooltip.Popup data-score-breakdown className={popupClass}>
            {content.title ? (
              <div className={content.boards?.length || content.children ? "mb-1 font-medium text-fg" : "font-medium text-fg"}>
                {content.title}
              </div>
            ) : null}
            {content.boards?.map((board) => (
              <div key={board.label} className="flex justify-between gap-3 py-0.5">
                <span className="text-mfg">{board.label}</span>
                <span className="num shrink-0 text-fg">{board.value}</span>
              </div>
            ))}
            {content.children}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
