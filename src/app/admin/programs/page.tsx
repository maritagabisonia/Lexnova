import type { Metadata } from "next";
import Link from "next/link";
import { getAdminPrograms } from "@/lib/admin-programs";
import { ArchiveProgramButton } from "./program-actions";

export const metadata: Metadata = {
  title: "Programs",
};

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl sm:text-4xl">Programs</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
            Create and edit courses and trainings. Archive hides a program from
            the public catalog without deleting it.
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          New Program
        </Link>
      </div>

      {programs.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">No programs yet.</p>
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
                  {program.typeLabel} · {program.statusLabel}
                </p>
                <p className="mt-1 text-ink-muted">
                  {program.startDate ?? "No start date"} · {program.registeredCount}{" "}
                  registered
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/admin/programs/${program.id}/edit`}
                    className="text-sm text-ink hover:text-accent"
                  >
                    Edit
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
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Start date</th>
                  <th className="py-2 pr-4 font-medium">Registered</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">{program.title}</td>
                    <td className="py-3 pr-4 text-ink-muted">{program.typeLabel}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {program.statusLabel}
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
                          Edit
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
