/**
 * [INPUT]: 依赖组合视图、复制动作与页面框架
 * [OUTPUT]: 对外提供组合列表、组合详情与 metadata
 * [POS]: src/views 的「做 X」页
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyActions } from "@/components/copy-block";
import { Frame } from "@/components/frame";
import { VendorMark } from "@/components/vendor-mark";
import { getBuild, listBuilds, slugs } from "@/lib/catalog";
import type { Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/locale";
import { pageMetadata } from "@/lib/site";

export function buildParams() {
  return slugs("builds").map((slug) => ({ slug }));
}

export function buildsMetadata(locale: Locale) {
  const dict = getDictionary(locale);
  return pageMetadata(locale, "/build", dict.build.indexTitle, dict.build.indexBody);
}

export async function buildMetadata(locale: Locale, params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const build = getBuild(locale, slug);
  if (!build) return {};
  return pageMetadata(locale, `/build/${slug}`, build.title, build.summary);
}

export function BuildIndex({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-16">
        <h1 className="display-page">{dict.build.indexTitle}</h1>
        <p className="mt-5 max-w-[720px] text-[17px] leading-relaxed text-mfg">{dict.build.indexBody}</p>
      </section>
      <div className="mx-4 mt-10 border-t border-line">
        {listBuilds(locale).map((build) => (
          <Link key={build.href} href={build.href} className="rowh block border-b border-line py-4">
            <span className="text-[16px] font-medium">{build.title}</span>
            <span className="mt-1 block text-[14px] leading-relaxed text-mfg">{build.summary}</span>
          </Link>
        ))}
      </div>
    </Frame>
  );
}

export async function BuildView({ locale, params }: { locale: Locale; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const build = getBuild(locale, slug);
  if (!build) notFound();
  const dict = getDictionary(locale);
  return (
    <Frame locale={locale}>
      <section className="px-4 pt-10 text-[12px] text-mfg">
        <Link href={localePath(locale, "/build")} className="num hover:text-fg">{dict.nav.builds}</Link>
        <span className="num mx-2 text-faint">/</span>
        <span className="num text-fg">{build.slug}</span>
      </section>
      <section className="px-4 pt-6">
        <h1 className="display-page">{build.title}</h1>
        <p className="mt-5 max-w-[720px] text-[17px] leading-relaxed text-mfg">{build.summary}</p>
        <p className="num mt-6 text-[12px] text-faint">{dict.build.edited} {build.updatedAt}{build.basis ? ` · ${dict.build.modelBasis} ${build.basis}` : ""}</p>
        {build.stale ? <p className="mt-4 max-w-[720px] text-[14px] text-mfg" data-stale="true">{dict.scenario.staleBanner}</p> : null}
      </section>
      <section className="pt-14">
        <div className="num mx-4 grid h-9 grid-cols-[110px_260px_1fr] items-center gap-6 border-b border-line text-[12px] text-faint">
          <span>{dict.build.colRole}</span><span>{dict.build.colPrimary}</span><span>{dict.build.colAlt}</span>
        </div>
        <div className="mx-4 overflow-x-auto">
          <div className="min-w-[680px]">
            {build.roles.map((role, index) => (
              <Link key={role.role} href={role.primary.href} data-stale={role.primary.stale ? "true" : undefined} className={`rowh grid grid-cols-[110px_260px_1fr] items-center gap-6 py-4 ${role.primary.stale ? "text-faint" : ""} ${index < build.roles.length - 1 ? "border-b border-line" : ""}`}>
                <span className="text-[14px] text-mfg">{role.role}</span>
                <span>
                  <span className={`flex items-center gap-2 text-[16px] ${role.primary.stale ? "font-normal" : "font-medium"}`}>
                    {role.primary.vendor ? <VendorMark vendor={role.primary.vendor} /> : null}
                    {role.primary.name}{role.extras.length ? ` + ${role.extras.map((extra) => extra.name).join(" + ")}` : ""}
                  </span>
                  <span className="num mt-1 block text-[11.5px] text-faint">{role.primary.meta}</span>
                </span>
                <span className="text-[14px] leading-relaxed text-mfg">{role.alternative}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pt-20">
        <header className="flex items-end justify-between pb-6">
          <h2 className="pt">{dict.build.take}</h2>
          <CopyActions text={build.agentsMd} copyLabel={dict.build.copy} copiedLabel={dict.build.copied} downloadLabel={dict.build.download} />
        </header>
        <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Code label="AGENTS.md" text={build.agentsMd} />
          <Code label={dict.item.install} text={build.installCmds} />
        </div>
      </section>
      <section className="px-4 pt-20">
        <header className="pb-6"><h2 className="pt">{dict.build.notFor}</h2></header>
        <div className="max-w-[780px] space-y-3 text-[15px] leading-relaxed text-mfg">
          {build.notFor.map((row) => (
            <p key={row.title}>
              {row.href ? <Link href={row.href} className="font-medium text-fg link-u">{row.title}</Link> : <span className="font-medium text-fg">{row.title}</span>}
              　{row.body}
            </p>
          ))}
        </div>
      </section>
      <section className="px-4 pt-20">
        <header className="pb-5"><h2 className="pt">{dict.build.evidence}</h2></header>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          {build.evidence.map((link) => <Link key={link.href} href={link.href} className="link-u">{link.label}</Link>)}
        </div>
      </section>
    </Frame>
  );
}

function Code({ label, text }: { label: string; text: string }) {
  return (
    <figure className="codefig">
      <div className="px-2.5 py-2 font-mono text-[13px] text-mfg">{label}</div>
      <pre className="rounded-lg bg-bg p-4 font-mono text-[12.5px] leading-7 whitespace-pre-wrap shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--border)_64%,transparent)]">{text}</pre>
    </figure>
  );
}
