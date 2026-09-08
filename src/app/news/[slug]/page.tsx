import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/cover-image";
import { ProgramCard } from "@/components/program-card";
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

  const published = article.published_at
    ? formatDate(article.published_at.slice(0, 10))
    : null;

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-sm text-ink-muted">
        <Link href="/news" className="hover:text-accent">
          News
        </Link>
      </p>

      <CoverImage
        src={article.cover_image_url}
        alt={article.title}
        className="mt-6 aspect-[16/9] w-full"
      />

      {published || article.author ? (
        <p className="mt-6 text-xs tracking-wide text-ink-muted">
          {[published, article.author].filter(Boolean).join(" · ")}
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

      {article.relatedProgram ? (
        <section className="mt-12">
          <h2 className="text-2xl">Related program</h2>
          <div className="mt-4">
            <ProgramCard program={article.relatedProgram} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
