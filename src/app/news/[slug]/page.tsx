import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate, getNewsBySlug } from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  return { title: article?.title ?? "News" };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      {article.published_at ? (
        <p className="text-xs tracking-wide text-ink-muted">
          {formatDate(article.published_at.slice(0, 10))}
          {article.author ? ` · ${article.author}` : ""}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl sm:text-5xl">{article.title}</h1>
      {article.short_description ? (
        <p className="mt-6 text-base leading-relaxed text-ink-muted">
          {article.short_description}
        </p>
      ) : null}
      {article.content ? (
        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-ink">
          {article.content}
        </div>
      ) : null}
    </article>
  );
}
