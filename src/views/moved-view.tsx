/**
 * [INPUT]: 依赖页面框架与已迁移场景的新地址
 * [OUTPUT]: 对外提供旧场景地址的说明页，并带立即跳转
 * [POS]: src/views 的移除场景回链
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { Frame } from "@/components/frame";
import type { Locale } from "@/lib/contracts";

export function MovedView({ locale, href, title, body, label }: { locale: Locale; href: string; title: string; body: string; label: string }) {
  return (
    <Frame locale={locale} width="home">
      <meta httpEquiv="refresh" content={`0; url=${href}`} />
      <section className="px-4 pt-16">
        <h1 className="display-page">{title}</h1>
        <p className="mt-5 max-w-[700px] text-[17px] leading-relaxed text-mfg">
          {body} <Link href={href} className="link-u">{label}</Link>
        </p>
      </section>
    </Frame>
  );
}
