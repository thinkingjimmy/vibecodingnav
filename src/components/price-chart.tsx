/**
 * [INPUT]: 依赖分数、混合价格与帕累托标记
 * [OUTPUT]: 对外提供分数对价格的散点，实心点是来源页列出的最优点
 * [POS]: src/components 的基准页价格图
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */

export interface PricePoint {
  name: string;
  score: number;
  price: number;
  priceLabel: string;
  pareto: boolean;
}

export function PriceChart({
  title,
  note,
  href,
  hrefLabel,
  points,
}: {
  title: string;
  note: string;
  href: string;
  hrefLabel: string;
  points: PricePoint[];
}) {
  const width = 640;
  const height = 280;
  const pad = { l: 48, r: 16, t: 12, b: 36 };
  const prices = points.map((point) => point.price);
  const scores = points.map((point) => point.score);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const x = (price: number) => pad.l + ((Math.log(price) - Math.log(minPrice)) / (Math.log(maxPrice) - Math.log(minPrice))) * (width - pad.l - pad.r);
  const y = (score: number) => pad.t + (1 - (score - minScore) / (maxScore - minScore)) * (height - pad.t - pad.b);
  const ticks = [0.2, 1, 4, 16, 40].filter((tick) => tick >= minPrice * 0.98 && tick <= maxPrice * 1.02);
  const frontier = points.filter((point) => point.pareto).sort((a, b) => b.score - a.score);

  return (
    <div className="px-4">
      <h2 className="pt">{title}</h2>
      <p className="mt-3 max-w-[760px] text-[14px] leading-relaxed text-mfg">{note}</p>
      <a href={href} className="num mt-3 inline-block text-[13px] link-u">{hrefLabel}</a>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="mt-6 w-full text-fg">
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={pad.t} y2={height - pad.b} stroke="currentColor" strokeOpacity="0.12" />
            <text x={x(tick)} y={height - 14} textAnchor="middle" fill="currentColor" opacity="0.55" fontSize="11">{tick}</text>
          </g>
        ))}
        <text x="12" y={y(maxScore) + 4} fill="currentColor" opacity="0.55" fontSize="11">{maxScore}</text>
        <text x="12" y={y(minScore)} fill="currentColor" opacity="0.55" fontSize="11">{minScore}</text>
        {points.filter((point) => !point.pareto).map((point) => (
          <circle key={point.name} cx={x(point.price)} cy={y(point.score)} r="3" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        ))}
        {frontier.map((point) => (
          <circle key={point.name} cx={x(point.price)} cy={y(point.score)} r="4.5" fill="currentColor" />
        ))}
      </svg>
      <ul className="mt-4 max-w-[760px]">
        {frontier.map((point) => (
          <li key={point.name} className="flex items-baseline justify-between gap-4 border-t border-line py-2 text-[14px]">
            <span className="truncate">{point.name}</span>
            <span className="num shrink-0 text-mfg">{point.score} · ${point.priceLabel}/M</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
