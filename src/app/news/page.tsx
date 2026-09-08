import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { getPublishedNews } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "News",
};

export default async function NewsIndexPage() {
  const news = await getPublishedNews();

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-5xl">News</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
        Notes from LexNova on programs, teaching, and public legal education.
      </p>
      {news.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-muted">
          No news has been published yet.
        </p>
      )}
    </section>
  );
}
