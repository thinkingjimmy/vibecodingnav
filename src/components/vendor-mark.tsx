/**
 * [INPUT]: 依赖厂商标识与 @lobehub/icons 的单色标
 * [OUTPUT]: 对外提供随文字颜色变化的厂商标，没有图标时用字母
 * [POS]: src/components 的内容标记，不是操作图标
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Claude from "@lobehub/icons/es/Claude/components/Mono";
import Cursor from "@lobehub/icons/es/Cursor/components/Mono";
import DeepSeek from "@lobehub/icons/es/DeepSeek/components/Mono";
import Gemini from "@lobehub/icons/es/Gemini/components/Mono";
import Grok from "@lobehub/icons/es/Grok/components/Mono";
import Kimi from "@lobehub/icons/es/Kimi/components/Mono";
import Meta from "@lobehub/icons/es/Meta/components/Mono";
import Minimax from "@lobehub/icons/es/Minimax/components/Mono";
import OpenAI from "@lobehub/icons/es/OpenAI/components/Mono";
import Qwen from "@lobehub/icons/es/Qwen/components/Mono";
import Tencent from "@lobehub/icons/es/Tencent/components/Mono";
import XiaomiMiMo from "@lobehub/icons/es/XiaomiMiMo/components/Mono";
import Zhipu from "@lobehub/icons/es/Zhipu/components/Mono";
import type { IconType } from "@lobehub/icons/es/types";
import type { VendorId } from "@/lib/contracts";
import { cn } from "@/lib/utils";

const marks: Partial<Record<VendorId, IconType>> = {
  anthropic: Claude,
  openai: OpenAI,
  kimi: Kimi,
  zhipu: Zhipu,
  qwen: Qwen,
  google: Gemini,
  meta: Meta,
  xai: Grok,
  xiaomi: XiaomiMiMo,
  tencent: Tencent,
  deepseek: DeepSeek,
  cursor: Cursor,
  minimax: Minimax,
};

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
  cursor: "Cu",
  minimax: "Mm",
};

export const LOBE_VENDORS = Object.keys(marks) as VendorId[];

export function VendorMark({ vendor, className }: { vendor: VendorId; className?: string }) {
  const Icon = marks[vendor];
  if (!Icon) {
    return (
      <span className={cn("num inline-grid size-3.5 shrink-0 place-items-center rounded-[3px] border border-current text-[9px] font-semibold leading-none text-fg", letters[vendor] === "mi" && "text-[7.5px]", className)}>
        {letters[vendor]}
      </span>
    );
  }
  return (
    <span className={cn("inline-grid size-3.5 shrink-0 place-items-center text-fg [&_svg]:size-full", className)}>
      <Icon size="100%" aria-hidden />
    </span>
  );
}
