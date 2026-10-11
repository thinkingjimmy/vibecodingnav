/**
 * [INPUT]: 依赖场景推荐组合条目（类型、名称、用途、模型高亮）与组合页链接
 * [OUTPUT]: 对外提供场景表后的「推荐组合」四列网格与完整搭配入口
 * [POS]: src/components 的场景页组合摘要
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import { ArrowRight, Cpu, Lightning, PlugsConnected, Shapes, SquaresFour, TextAa, WaveSine } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Dictionary, Item, VendorId } from "@/lib/contracts";
import { VendorMark } from "./vendor-mark";

export type ComboGridItem = {
  type: string;
  name: string;
  href: string;
  purpose: string;
  vendor?: VendorId;
  highlight?: boolean;
  itemType?: Item["type"];
};

function ItemGlyph({ itemType, slugHint }: { itemType?: Item["type"]; slugHint: string }) {
  const lower = slugHint.toLowerCase();
  if (lower.includes("phosphor") || lower.includes("icon")) return <Shapes size={16} className="shrink-0 text-mfg" aria-hidden />;
  if (lower.includes("geist") || lower.includes("font") || lower.includes("wenkai")) return <TextAa size={16} className="shrink-0 text-mfg" aria-hidden />;
  if (lower.includes("motion") || lower.includes("gsap") || lower.includes("anime")) return <WaveSine size={16} className="shrink-0 text-mfg" aria-hidden />;
  if (lower.includes("mcp") || lower.includes("figma") || itemType === "plugin") return <PlugsConnected size={16} className="shrink-0 text-mfg" aria-hidden />;
  if (itemType === "skill") return <Lightning size={16} className="shrink-0 text-mfg" aria-hidden />;
  if (itemType === "prompt") return <Cpu size={16} className="shrink-0 text-mfg" aria-hidden />;
  return <SquaresFour size={16} className="shrink-0 text-mfg" aria-hidden />;
}

export function ScenarioComboGrid({
  title,
  href,
  items,
  dict,
}: {
  title: string;
  href: string;
  items: ComboGridItem[];
  dict: Dictionary;
}) {
  return (
    <section className="px-4 pt-16">
      <h2 className="pt">{title}</h2>
      <div className="mt-[18px] grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.name}`}
            href={item.href}
            className="block border-b border-line py-3.5 pr-4 no-underline"
          >
            <div className="num text-[11px] text-faint">{item.type}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[14.5px] font-medium">
              {item.highlight ? (
                <VendorMark vendor={item.vendor} />
              ) : (
                <ItemGlyph itemType={item.itemType} slugHint={item.name} />
              )}
              <span>{item.name}</span>
            </div>
            {item.purpose ? <p className="mt-0.5 text-[12.5px] leading-snug text-mfg">{item.purpose}</p> : null}
          </Link>
        ))}
        <Link
          href={href}
          className="flex items-center gap-1.5 border-b border-line py-3.5 pr-4 text-[13.5px] text-mfg no-underline hover:text-fg"
        >
          <span>{dict.scenario.comboFullLink.replace(/\s*→\s*$/, "")}</span>
          <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
