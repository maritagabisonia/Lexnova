import { getTranslations } from "next-intl/server";
import { UsersTable } from "./users-table";
import { getAdminUsers } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/require-auth";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("users") };
}

export default async function AdminUsersPage() {
  const t = await getTranslations("admin");
  const { user } = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">{t("users")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("usersLead")}
      </p>
      <UsersTable users={users} currentUserId={user.id} />
    </section>
  );
}
