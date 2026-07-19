/**
 * [INPUT]: 依赖模型注册表、六语言字典/路径、站点 SEO 常量与模型详情区块组件
 * [OUTPUT]: 对外提供共享模型详情页面组装器与 canonical/hreflang metadata 生成器
 * [POS]: src/app 的模型详情路由内核，被默认英文与本地化动态 slug 页面共同消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BenchmarkTable } from "@/components/benchmark-table";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { ReviewFeed } from "@/components/review-feed";
import { Reviews } from "@/components/reviews";
import { LOCALES, type Locale } from "@/lib/contracts";
import { getDictionary } from "@/lib/i18n";
import { getModelEvaluation, type ModelSlug } from "@/lib/model";
import { modelPath, SITE_ICON, SITE_URL } from "@/lib/site";

export function createModelMetadata(locale: Locale, slug: ModelSlug): Metadata {
  const dictionary = getDictionary(locale);
  const languages = Object.fromEntries(
    LOCALES.map((item) => [item, `${SITE_URL}${modelPath(item, slug)}`]),
  );

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    icons: {
      icon: SITE_ICON,
      shortcut: SITE_ICON,
      apple: SITE_ICON,
    },
    alternates: {
      canonical: `${SITE_URL}${modelPath(locale, slug)}`,
      languages: {
        ...languages,
        "x-default": `${SITE_URL}${modelPath("en", slug)}`,
      },
    },
  };
}

export function ModelDetail({ locale, slug }: { locale: Locale; slug: ModelSlug }) {
  const evaluation = getModelEvaluation(slug);
  if (!evaluation) notFound();
  const dictionary = getDictionary(locale);

  return (
    <>
      <Header dictionary={dictionary} locale={locale} modelSlug={slug} />
      <main className="mx-auto max-w-5xl px-5">
        <Hero dictionary={dictionary} evaluation={evaluation} />
        <BenchmarkTable dictionary={dictionary} evaluation={evaluation} />
        <Reviews dictionary={dictionary} evaluation={evaluation} locale={locale} />
        <ReviewFeed dictionary={dictionary} evaluation={evaluation} locale={locale} />
      </main>
      <Footer dictionary={dictionary} evaluation={evaluation} />
    </>
  );
}
