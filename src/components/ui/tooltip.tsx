/**
 * [INPUT]: 依赖 @base-ui/react/tooltip 的无障碍浮层 primitive 与 cn 类名合并工具
 * [OUTPUT]: 对外提供 TooltipProvider、Tooltip、TooltipTrigger、TooltipContent 组件
 * [POS]: src/components/ui 的 shadcn Base UI 提示 primitive，portal 渲染规避滚动容器裁剪
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

function TooltipProvider({ delay = 100, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip(props: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ delay = 100, ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" delay={delay} {...props} />;
}

function TooltipContent({
  align = "center",
  side = "top",
  sideOffset = 6,
  className,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          className={cn(
            "max-w-72 rounded border border-hairline bg-ink px-2.5 py-1.5 font-mono text-[10px] font-normal leading-[1.5] text-elevated shadow-sm outline-none",
            className,
          )}
          data-slot="tooltip-content"
          role="tooltip"
          {...props}
        />
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
