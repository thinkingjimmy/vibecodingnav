/**
 * [INPUT]: 依赖 Base UI Popover 与列头说明内容
 * [OUTPUT]: 对外提供锚定表头的可交互说明弹层（悬停桥接、键盘焦点与链接触达）
 * [POS]: src/components 的场景列头说明 primitive
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Popover } from "@base-ui/react/popover";
import type { ReactElement, ReactNode } from "react";

const popupClass =
  "max-w-[300px] rounded-lg border border-bd bg-bg px-3 py-2.5 text-[12.5px] leading-snug text-mfg shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] outline-none dark:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.55)]";

const OPEN_DELAY = 150;
const CLOSE_DELAY = 150;

type TriggerRender = (props: Record<string, unknown>) => ReactElement;

export function ColumnInfoPopover({
  children,
  label,
  render,
}: {
  children: ReactNode;
  label: string;
  render: TriggerRender;
}) {
  return (
    <Popover.Root
      modal={false}
      onOpenChange={(_open, details) => {
        // 点击列头只负责排序，不切换弹层；悬停/焦点/Esc 仍照常开关。
        if (details.reason === "trigger-press") details.cancel();
      }}
    >
      <Popover.Trigger
        openOnHover
        delay={OPEN_DELAY}
        closeDelay={CLOSE_DELAY}
        render={(props) => render({ ...props, "aria-label": label })}
      />
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          collisionAvoidance={{ side: "flip", align: "shift", fallbackAxisSide: "end" }}
          className="z-50"
        >
          <Popover.Popup
            data-column-info
            className={popupClass}
            initialFocus={false}
          >
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
