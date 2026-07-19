/**
 * [INPUT]: 依赖 locale 静态参数、类型化内容、字典访问层与五个页面区块组件
 * [OUTPUT]: 对外生成六语言 Kimi K3 静态详情页及含共享品牌图标的本地化 SEO metadata
 * [POS]: src/app/[locale] 的页面组装根，保持数据读取在 Server Component 边界内
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BenchmarkTable } from "@/components/benchmark-table";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Reviews } from "@/components/reviews";
import { LOCALES } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/locale";
import { evaluation } from "@/lib/model";
import { localePath, SITE_ICON, SITE_URL } from "@/lib/site";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);
  const languages = Object.fromEntries(LOCALES.map((item) => [item, `${SITE_URL}${localePath(item)}`]));

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    icons: {
      icon: SITE_ICON,
      shortcut: SITE_ICON,
      apple: SITE_ICON,
    },
    alternates: {
      canonical: `${SITE_URL}${localePath(locale)}`,
      languages: { ...languages, "x-default": `${SITE_URL}/en/` },
    },
  };
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dictionary = getDictionary(locale);

  return (
    <>
      <Header dictionary={dictionary} locale={locale} />
      <main className="mx-auto max-w-5xl px-5">
        <Hero dictionary={dictionary} evaluation={evaluation} />
        <BenchmarkTable dictionary={dictionary} evaluation={evaluation} />
        <Reviews dictionary={dictionary} evaluation={evaluation} locale={locale} />
      </main>
      <Footer dictionary={dictionary} evaluation={evaluation} locale={locale} />
    </>
  );
}
