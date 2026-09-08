import type { MetadataRoute } from "next";
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

  const staticPages: MetadataRoute.Sitemap = publicSitemapPaths.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...programs.map((program) => ({
      url: `${base}/programs/${program.slug}`,
      lastModified: program.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...news.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.published_at ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
