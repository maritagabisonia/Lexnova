import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminPrograms } from "@/lib/admin-programs";
import {
  translatedStatusLabel,
  translatedTypeLabel,
} from "@/lib/program-display";
import { requireAdmin } from "@/lib/require-auth";
import { ArchiveProgramButton } from "./program-actions";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("programs") };
}

export default async function AdminProgramsPage() {
  const t = await getTranslations("admin");
  const programsT = await getTranslations("programs");
  await requireAdmin();
  const programs = await getAdminPrograms();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">{t("programs")}</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            {t("programsLead")}
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          {t("newProgram")}
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">{t("noPrograms")}</p>
      ) : (
        <>
          <ul className="mt-8 space-y-3 sm:hidden">
            {programs.map((program) => (
              <li
                key={program.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">{program.title}</p>
                <p className="mt-1 text-ink-muted">
                  {translatedTypeLabel(program.type, programsT)} ·{" "}
                  {translatedStatusLabel(program.status, programsT)}
                </p>
                <p className="mt-1 text-ink-muted">
                  {program.startDate ?? t("noStartDate")} ·{" "}
                  {t("registeredCount", { count: program.registeredCount })}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/programs/${program.id}/edit`}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {t("edit")}
                  </Link>
                  {program.status !== "archived" ? (
                    <ArchiveProgramButton programId={program.id} compact />
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
                  <th className="py-2 pr-4 font-medium">{t("type")}</th>
                  <th className="py-2 pr-4 font-medium">{t("status")}</th>
                  <th className="py-2 pr-4 font-medium">{t("startDate")}</th>
                  <th className="py-2 pr-4 font-medium">{t("registered")}</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">{t("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">{program.title}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {translatedTypeLabel(program.type, programsT)}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {translatedStatusLabel(program.status, programsT)}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                      {program.startDate ?? "—"}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {program.registeredCount}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {t("edit")}
                        </Link>
                        {program.status !== "archived" ? (
                          <ArchiveProgramButton programId={program.id} compact />
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
