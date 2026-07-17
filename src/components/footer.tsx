/**
 * [INPUT]: 依赖 ModelEvaluation 的来源与更新时间、Dictionary 的页脚文案
 * [OUTPUT]: 对外提供数据源、免责声明和翻译说明页脚
 * [POS]: src/components 的详情页 Footer Server Component
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Dictionary, ModelEvaluation } from "@/lib/contracts";

interface FooterProps {
  dictionary: Dictionary;
  evaluation: ModelEvaluation;
}

export function Footer({ dictionary, evaluation }: FooterProps) {
  return (
    <footer className="mt-14 border-t border-hairline pb-12 pt-6">
      <h2 className="mb-3 font-mono text-[10px] uppercase tracking-[.12em] text-ink-faint">{dictionary.footer.sources}</h2>
      <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
        {evaluation.sources.map((source) => (
          <li key={source.url}>
            <a className="font-mono text-[11px] text-accent-text underline decoration-hairline-strong underline-offset-2 hover:decoration-accent" href={source.url} rel="noopener" target="_blank">{source.name}</a>
          </li>
        ))}
      </ul>
      <p className="mt-5 font-serif text-[12px] leading-[1.6] text-ink-soft">{dictionary.footer.disclaimer}</p>
      <p className="mt-1.5 font-mono text-[10px] text-ink-faint">{dictionary.footer.updated} {evaluation.updated} · {dictionary.footer.aiNote}</p>
    </footer>
  );
}
