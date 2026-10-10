/**
 * [INPUT]: 依赖厂商标识
 * [OUTPUT]: 对外提供单色字母厂商标
 * [POS]: src/components 的内容标记，不是操作图标
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { VendorId } from "@/lib/contracts";
import { cn } from "@/lib/utils";

const letters: Record<VendorId, string> = {
  anthropic: "A",
  openai: "O",
  kimi: "K",
  zhipu: "Z",
  qwen: "Q",
  google: "G",
  meta: "M",
  xai: "x",
  xiaomi: "mi",
  tencent: "T",
  deepseek: "D",
};

export function VendorMark({ vendor, className = "" }: { vendor: VendorId; className?: string }) {
  return (
    <span className={cn("num inline-grid size-3.5 shrink-0 place-items-center rounded-[3px] border border-current text-[9px] font-semibold leading-none", letters[vendor] === "mi" && "text-[7.5px]", className)}>
      {letters[vendor]}
    </span>
  );
}
