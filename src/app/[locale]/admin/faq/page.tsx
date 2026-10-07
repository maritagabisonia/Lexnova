import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminFaqRows } from "@/lib/admin-faq";
import { requireAdmin } from "@/lib/require-auth";
import { DeleteFaqButton, MoveFaqButton } from "./faq-actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("faq") };
}

export default async function AdminFaqPage() {
  const t = await getTranslations("admin");
  const form = await getTranslations("admin.form");
  await requireAdmin();
  const items = await getAdminFaqRows();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">{t("faq")}</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            {t("faqLead")}
          </p>
        </div>
        <Link
          href="/admin/faq/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          {t("newFaq")}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">{t("noFaq")}</p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 sm:hidden">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">{item.questionKa || item.questionEn}</p>
                {item.questionKa && item.questionEn ? (
                  <p className="mt-1 text-ink-muted">{item.questionEn}</p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <MoveFaqButton
                    id={item.id}
                    direction="up"
                    disabled={index === 0}
                  />
                  <MoveFaqButton
                    id={item.id}
                    direction="down"
                    disabled={index === items.length - 1}
                  />
                  <Link
                    href={`/admin/faq/${item.id}/edit`}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {t("edit")}
                  </Link>
                  <DeleteFaqButton id={item.id} question={item.question} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">{form("georgian")}</th>
                  <th className="py-2 pr-4 font-medium">{form("english")}</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">
                      {item.questionKa || "—"}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {item.questionEn || "—"}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <div className="flex items-center gap-2">
                        <MoveFaqButton
                          id={item.id}
                          direction="up"
                          disabled={index === 0}
                        />
                        <MoveFaqButton
                          id={item.id}
                          direction="down"
                          disabled={index === items.length - 1}
                        />
                        <Link
                          href={`/admin/faq/${item.id}/edit`}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {t("edit")}
                        </Link>
                        <DeleteFaqButton id={item.id} question={item.question} />
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
