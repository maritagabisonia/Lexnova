import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAdminOverview } from "@/lib/admin-overview";
import { seoMetadata } from "@/lib/page-metadata";
import { requireAdmin } from "@/lib/require-auth";

export async function generateMetadata() {
  return seoMetadata("adminOverview");
}

export default async function AdminOverviewPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  const { stats, recent } = await getAdminOverview();

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">{t("overview")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("overviewLead")}
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label={t("activePrograms")} value={stats.activePrograms} />
        <StatCard
          label={t("startingSoon")}
          value={stats.programsStartingSoon}
        />
        <StatCard
          label={t("registeredStudents")}
          value={stats.registeredStudents}
        />
      </dl>

      <h2 className="mt-12 text-2xl">{t("recentRegistrations")}</h2>
      <RecentRegistrations rows={recent} emptyLabel={t("noRegistrations")} studentLabel={t("student")} programLabel={t("program")} dateLabel={t("date")} />
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink/10 bg-paper p-5">
      <dt className="text-xs tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-2 font-serif text-4xl tracking-tight text-ink">{value}</dd>
    </div>
  );
}

function RecentRegistrations({
  rows,
  emptyLabel,
  studentLabel,
  programLabel,
  dateLabel,
}: {
  rows: Awaited<ReturnType<typeof getAdminOverview>>["recent"];
  emptyLabel: string;
  studentLabel: string;
  programLabel: string;
  dateLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="mt-4 text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <>
      <ul className="mt-4 space-y-3 sm:hidden">
        {rows.map((row) => (
          <li
            key={row.id}
            className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
          >
            <p className="text-ink">{row.studentName}</p>
            <p className="mt-1 text-ink-muted">
              {row.programSlug ? (
                <Link
                  href={`/programs/${row.programSlug}`}
                  className="hover:text-accent"
                >
                  {row.programTitle}
                </Link>
              ) : (
                row.programTitle
              )}
            </p>
            {row.registeredOn ? (
              <p className="mt-1 text-ink-muted">{row.registeredOn}</p>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
              <th className="py-2 pr-4 font-medium">{studentLabel}</th>
              <th className="py-2 pr-4 font-medium">{programLabel}</th>
              <th className="py-2 font-medium">{dateLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-ink/10">
                <td className="py-3 pr-4 text-ink">{row.studentName}</td>
                <td className="py-3 pr-4 text-ink-muted">
                  {row.programSlug ? (
                    <Link
                      href={`/programs/${row.programSlug}`}
                      className="hover:text-accent"
                    >
                      {row.programTitle}
                    </Link>
                  ) : (
                    row.programTitle
                  )}
                </td>
                <td className="whitespace-nowrap py-3 text-ink-muted">
                  {row.registeredOn ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
