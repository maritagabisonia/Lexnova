import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAdminUser } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/require-auth";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("admin");
  const user = await getAdminUser(id);
  return { title: user ? user.name : t("fallbackUser") };
}

export default async function AdminUserDetailPage({ params }: Props) {
  const t = await getTranslations("admin");
  const roles = await getTranslations("roles");
  await requireAdmin();
  const { id } = await params;
  const user = await getAdminUser(id);
  if (!user) {
    notFound();
  }

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/users" className="text-ink-muted hover:text-accent">
          {t("users")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{user.name}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {user.email} · {roles(user.role)} · {t("joined", { date: user.joinedAt })}
      </p>

      <h2 className="mt-10 text-2xl">{t("registrationHistory")}</h2>
      {user.registrations.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          {t("noUserRegistrations")}
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-3 sm:hidden">
            {user.registrations.map((row) => (
              <li
                key={row.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p>
                  <Link
                    href={`/admin/programs/${row.programId}/edit?tab=students`}
                    className="text-ink hover:text-accent"
                  >
                    {row.programTitle}
                  </Link>
                </p>
                <p className="mt-1 text-ink-muted">
                  {row.typeLabel} · {row.programStatusLabel}
                </p>
                <p className="mt-1 text-ink-muted">
                  {row.statusLabel} · {row.registeredAt}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">{t("program")}</th>
                  <th className="py-2 pr-4 font-medium">{t("type")}</th>
                  <th className="py-2 pr-4 font-medium">{t("programStatus")}</th>
                  <th className="py-2 pr-4 font-medium">{t("registration")}</th>
                  <th className="py-2 font-medium">{t("registered")}</th>
                </tr>
              </thead>
              <tbody>
                {user.registrations.map((row) => (
                  <tr key={row.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">
                      <Link
                        href={`/admin/programs/${row.programId}/edit?tab=students`}
                        className="hover:text-accent"
                      >
                        {row.programTitle}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">{row.typeLabel}</td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {row.programStatusLabel}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">{row.statusLabel}</td>
                    <td className="whitespace-nowrap py-3 text-ink-muted">
                      {row.registeredAt}
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
