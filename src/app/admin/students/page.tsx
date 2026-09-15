import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";
import { requireAdmin } from "@/lib/require-auth";

export const metadata: Metadata = {
  title: "Students",
};

export default async function AdminStudentsPage() {
  await requireAdmin();
  return (
    <AdminPlaceholder
      title="Students"
      description="Review student accounts and their registrations."
    />
  );
}
