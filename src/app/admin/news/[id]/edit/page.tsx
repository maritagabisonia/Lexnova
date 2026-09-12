import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminArticle, getAdminRelatedPrograms } from "@/lib/admin-news";
import { ArticleForm } from "../../article-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getAdminArticle(id);
  return { title: article ? `Edit ${article.title}` : "Edit article" };
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, programs] = await Promise.all([
    getAdminArticle(id),
    getAdminRelatedPrograms(),
  ]);

  if (!article?.id) {
    notFound();
  }

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/news" className="text-ink-muted hover:text-accent">
          News
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Edit article</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Update this article. Unpublish or archive it to hide it from the public
        news page without deleting the row.
      </p>
      <ArticleForm mode="edit" article={article} programs={programs} />
    </section>
  );
}
