/**
 * [INPUT]: 依赖 Base UI Dialog 与 Phosphor X
 * [OUTPUT]: 对外提供对话框右上角仅图标的关闭按钮（aria-label 承载文案）
 * [POS]: src/components/ui 的无业务语义 primitive
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";

export function DialogCloseButton({ label }: { label: string }) {
  return (
    <Dialog.Close
      aria-label={label}
      className="grid size-8 shrink-0 place-items-center rounded-[7px] text-faint hover:bg-muted hover:text-fg"
    >
      <X size={16} aria-hidden />
    </Dialog.Close>
  );
}
