import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  emptyNewsFormValues,
  getAdminRelatedPrograms,
} from "@/lib/admin-news";
import { requireAdmin } from "@/lib/require-auth";
import { ArticleForm } from "../article-form";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("newArticle") };
}

export default async function NewArticlePage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  const programs = await getAdminRelatedPrograms();

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/news" className="text-ink-muted hover:text-accent">
          {t("news")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("newArticle")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("newArticleLead")}
      </p>
      <ArticleForm
        mode="create"
        article={emptyNewsFormValues}
        programs={programs}
      />
    </section>
  );
}
