import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPublishedNews } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "News",
};

export default async function NewsIndexPage() {
  const news = await getPublishedNews();

  return (
    <section className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-5xl">News</h1>
      {news.length > 0 ? (
        <ul className="mt-10 space-y-8">
          {news.map((article) => (
            <li key={article.id}>
              <p className="text-xs tracking-wide text-ink-muted">
                {article.published_at
                  ? formatDate(article.published_at.slice(0, 10))
                  : null}
              </p>
              <h2 className="mt-2 text-2xl">
                <Link href={`/news/${article.slug}`} className="hover:text-accent">
                  {article.title}
                </Link>
              </h2>
              {article.short_description ? (
                <p className="mt-2 text-sm text-ink-muted">
                  {article.short_description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-ink-muted">
          No news has been published yet.
        </p>
      )}
    </section>
  );
}
