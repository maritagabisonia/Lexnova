import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminLecturerRows } from "@/lib/admin-lecturers";
import { requireAdmin } from "@/lib/require-auth";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("lecturers") };
}

export default async function AdminLecturersPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  const lecturers = await getAdminLecturerRows();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">{t("lecturers")}</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            {t("lecturersLead")}
          </p>
        </div>
        <Link
          href="/admin/lecturers/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          {t("newLecturer")}
        </Link>
      </div>

      {lecturers.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">{t("noLecturers")}</p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 sm:hidden">
            {lecturers.map((lecturer) => (
              <li
                key={lecturer.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">{lecturer.fullName}</p>
                {lecturer.title ? (
                  <p className="mt-1 text-ink-muted">{lecturer.title}</p>
                ) : null}
                <div className="mt-3">
                  <Link
                    href={`/admin/lecturers/${lecturer.id}/edit`}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {t("edit")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">{t("name")}</th>
                  <th className="py-2 pr-4 font-medium">{t("form.title")}</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">{lecturer.fullName}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {lecturer.title ?? "—"}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <Link
                        href={`/admin/lecturers/${lecturer.id}/edit`}
                        className="text-sm text-ink hover:text-accent"
                      >
                        {t("edit")}
                      </Link>
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
