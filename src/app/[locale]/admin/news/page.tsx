import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminNews } from "@/lib/admin-news";
import { requireAdmin } from "@/lib/require-auth";
import { ArchiveArticleButton } from "./article-actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("news") };
}

export default async function AdminNewsPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  const articles = await getAdminNews();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">{t("news")}</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            {t("newsLead")}
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          {t("newArticle")}
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">{t("noArticles")}</p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 sm:hidden">
            {articles.map((article) => (
              <li
                key={article.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">{article.title}</p>
                <p className="mt-1 text-ink-muted">
                  {article.publishedLabel}
                  {article.publishedAt ? ` · ${article.publishedAt}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/news/${article.id}/edit`}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {t("edit")}
                  </Link>
                  {article.published ? (
                    <ArchiveArticleButton articleId={article.id} compact />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">{t("title")}</th>
                  <th className="py-2 pr-4 font-medium">{t("published")}</th>
                  <th className="py-2 pr-4 font-medium">{t("publishedAt")}</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">{article.title}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {article.publishedLabel}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                      {article.publishedAt ?? "—"}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/news/${article.id}/edit`}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {t("edit")}
                        </Link>
                        {article.published ? (
                          <ArchiveArticleButton articleId={article.id} compact />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
