/**
 * [INPUT]: 依赖 next/image/link、Phosphor ArrowRight 与共享品牌图标
 * [OUTPUT]: 对外提供 noindex 根路径占位页与 Kimi K3 模型详情入口
 * [POS]: src/app/(root) 的临时品牌落点，不承载正式 Home 内容
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Metadata } from "next";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import Image from "next/image";
import Link from "next/link";
import { SITE_ICON } from "@/lib/site";

export const metadata: Metadata = {
  title: "AIEvalIndex",
  icons: {
    icon: SITE_ICON,
    shortcut: SITE_ICON,
    apple: SITE_ICON,
  },
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-12">
      <div className="mx-auto max-w-xl text-center">
        <Image
          alt=""
          aria-hidden="true"
          className="mx-auto size-14"
          height={56}
          src={SITE_ICON.url}
          unoptimized
          width={56}
        />
        <p className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[.2em] text-ink-faint">
          AI Eval Index
        </p>
        <h1 className="mt-3 font-serif text-[46px] font-medium leading-[1.05] tracking-[-.03em] text-ink sm:text-[58px]">
          Home is coming soon.
        </h1>
        <p className="mx-auto mt-5 max-w-md font-serif text-[18px] leading-relaxed text-ink-soft">
          Start with our first independent frontier-model evaluation.
        </p>
        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-hairline-strong bg-elevated px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[.1em] text-accent-text transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          href="/models/kimi-k3/"
        >
          View Kimi K3
          <ArrowRightIcon aria-hidden="true" size={14} weight="bold" />
        </Link>
      </div>
    </main>
  );
}
