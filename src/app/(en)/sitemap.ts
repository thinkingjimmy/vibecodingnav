/**
 * [INPUT]: 依赖目录 slug 与本地化路径
 * [OUTPUT]: 对外提供 /sitemap.xml
 * [POS]: src/app/(en) 的站点地图
 * [PROTOCOL]: 变更时更新此头部，然后检查 README.md
 */
import type { MetadataRoute } from "next";
import { itemSlugs, slugs } from "@/lib/catalog";
import { ITEM_SEGMENT, LOCALES, type ItemType } from "@/lib/contracts";
import { localePath } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const types: ItemType[] = ["library", "skill", "plugin", "prompt", "tool"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/scenarios",
    "/models",
    "/tools",
    "/build",
    "/benchmarks",
    "/changes",
    ...slugs("scenarios").map((slug) => `/scenarios/${slug}`),
    ...slugs("models").map((slug) => `/models/${slug}`),
    ...slugs("categories").map((slug) => `/tools/${slug}`),
    ...slugs("builds").map((slug) => `/build/${slug}`),
    ...slugs("benchmarks").map((slug) => `/benchmarks/${slug}`),
    ...types.flatMap((type) => itemSlugs(type).map((slug) => `/${ITEM_SEGMENT[type]}/${slug}`)),
  ];
  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((item) => [item, `${SITE_URL}${localePath(item, path)}`])),
      },
    })),
  );
}
