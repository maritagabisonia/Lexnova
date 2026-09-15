import type { Metadata } from "next";
import { UsersTable } from "./users-table";
import { getAdminUsers } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/require-auth";

export const metadata: Metadata = {
  title: "Users",
};

export default async function AdminUsersPage() {
  const { user } = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">Users</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Every profile on LexNova. Search by name or email, change roles, and
        open a student to see their registration history.
      </p>
      <UsersTable users={users} currentUserId={user.id} />
    </section>
  );
}
