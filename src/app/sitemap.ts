import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { withLocalePrefix } from "@/i18n/path";
import {
  getProgramSitemapEntries,
  getPublishedNewsSitemapEntries,
} from "@/lib/catalog";
import { getSiteUrl, publicSitemapPaths } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [programs, news] = await Promise.all([
    getProgramSitemapEntries(),
    getPublishedNewsSitemapEntries(),
  ]);

  const staticPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    publicSitemapPaths.map((path) => {
      const localized = withLocalePrefix(path, locale);
      return {
        url: `${base}${localized}`,
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.8,
      };
    }),
  );

  return [
    ...staticPages,
    ...routing.locales.flatMap((locale) =>
      programs.map((program) => ({
        url: `${base}${withLocalePrefix(`/programs/${program.slug}`, locale)}`,
        lastModified: program.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ),
    ...routing.locales.flatMap((locale) =>
      news.map((article) => ({
        url: `${base}${withLocalePrefix(`/news/${article.slug}`, locale)}`,
        lastModified: article.published_at ?? undefined,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ),
  ];
}
