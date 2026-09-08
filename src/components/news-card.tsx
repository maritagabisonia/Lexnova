import Link from "next/link";
import { CoverImage } from "@/components/cover-image";
import { formatDate } from "@/lib/program-display";
import type { NewsSummary } from "@/lib/catalog";

export function NewsCard({ article }: { article: NewsSummary }) {
  const published = article.published_at
    ? formatDate(article.published_at.slice(0, 10))
    : null;

  return (
    <article className="flex h-full flex-col border border-ink/10 bg-paper">
      <CoverImage
        src={article.cover_image_url}
        alt={article.title}
        className="aspect-[16/9] w-full"
      />
      <div className="flex flex-1 flex-col p-5">
        {published ? (
          <p className="text-xs tracking-wide text-ink-muted">{published}</p>
        ) : null}
        <h2 className="mt-2 text-xl">
          <Link href={`/news/${article.slug}`} className="hover:text-accent">
            {article.title}
          </Link>
        </h2>
        {article.short_description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
            {article.short_description}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <Link
          href={`/news/${article.slug}`}
          className="mt-5 text-sm text-ink hover:text-accent"
        >
          Read article
        </Link>
      </div>
    </article>
  );
}
