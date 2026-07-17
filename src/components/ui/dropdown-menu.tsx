/**
 * [INPUT]: 依赖 @base-ui/react/menu 的无障碍菜单 primitive、Phosphor 选中图标与 cn 类名合并工具
 * [OUTPUT]: 对外提供 DropdownMenu Root、Trigger、Content、RadioGroup 与 RadioItem 组件
 * [POS]: src/components/ui 的 shadcn Base UI 菜单 primitive，为上层业务组件统一弹层与键盘交互
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { cn } from "@/lib/utils";

function DropdownMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger(props: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50 outline-none"
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          className={cn(
            "z-50 max-h-(--available-height) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border border-hairline bg-elevated p-1 text-ink outline-none",
            className,
          )}
          data-slot="dropdown-menu-content"
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuRadioGroup(props: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  children,
  className,
  ...props
}: MenuPrimitive.RadioItem.Props) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm py-2 pr-8 pl-2 font-mono text-[11px] font-medium text-ink-soft outline-none focus:bg-subtle focus:text-ink data-checked:text-accent-text data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      data-slot="dropdown-menu-radio-item"
      {...props}
    >
      {children}
      <span
        className="pointer-events-none absolute right-2 flex size-4 items-center justify-center text-accent-text"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon aria-hidden="true" size={14} />
        </MenuPrimitive.RadioItemIndicator>
      </span>
    </MenuPrimitive.RadioItem>
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
};
