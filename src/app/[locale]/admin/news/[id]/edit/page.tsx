import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAdminArticle, getAdminRelatedPrograms } from "@/lib/admin-news";
import { requireAdmin } from "@/lib/require-auth";
import { ArticleForm } from "../../article-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("admin");
  const article = await getAdminArticle(id);
  return { title: article ? t("editNamed", { name: article.title }) : t("editArticle") };
}

export default async function EditArticlePage({ params }: Props) {
  const t = await getTranslations("admin");
  await requireAdmin();
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
          {t("news")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("editArticle")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("editArticleLead")}
      </p>
      <ArticleForm mode="edit" article={article} programs={programs} />
    </section>
  );
}
