import { getTranslations } from "next-intl/server";
import { NewsCard } from "@/components/news-card";
import { getPublishedNews } from "@/lib/catalog";
import { seoMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return seoMetadata("news");
}

export default async function NewsIndexPage() {
  const t = await getTranslations("news");
  const news = await getPublishedNews();

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
        {t("intro")}
      </p>
      {news.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-muted">{t("empty")}</p>
      )}
    </section>
  );
}
