import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOverview } from "@/lib/admin-overview";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function AdminOverviewPage() {
  const { stats, recent } = await getAdminOverview();

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">Overview</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        A snapshot of programs and registrations.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active programs" value={stats.activePrograms} />
        <StatCard
          label="Starting in the next 30 days"
          value={stats.programsStartingSoon}
        />
        <StatCard
          label="Registered students"
          value={stats.registeredStudents}
        />
      </dl>

      <h2 className="mt-12 text-2xl">Recent registrations</h2>
      <RecentRegistrations rows={recent} />
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
}: {
  rows: Awaited<ReturnType<typeof getAdminOverview>>["recent"];
}) {
  if (rows.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink-muted">No registrations yet.</p>
    );
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
              <th className="py-2 pr-4 font-medium">Student</th>
              <th className="py-2 pr-4 font-medium">Program</th>
              <th className="py-2 font-medium">Date</th>
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
