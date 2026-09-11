import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export const metadata: Metadata = {
  title: "Users",
};

export default function AdminUsersPage() {
  return (
    <AdminPlaceholder
      title="Users"
      description="Manage account roles for students, teachers, and admins."
    />
  );
}
