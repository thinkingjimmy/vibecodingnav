/**
 * [INPUT]: 依赖 Phosphor Smiley 的六种字重
 * [OUTPUT]: 对外提供 Phosphor 字重示意
 * [POS]: src/components 的库详情可视化
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
"use client";

import { Smiley } from "@phosphor-icons/react";

const weights = ["thin", "light", "regular", "bold", "fill", "duotone"] as const;

export function PhosphorWeights() {
  return (
    <div className="grid grid-cols-3 gap-6 text-center sm:grid-cols-6">
      {weights.map((weight) => (
        <div key={weight} className="py-6">
          <div className="grid place-items-center"><Smiley size={44} weight={weight} /></div>
          <div className="num mt-3 text-[12px] text-mfg capitalize">{weight}</div>
        </div>
      ))}
    </div>
  );
}
