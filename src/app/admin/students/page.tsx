import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export const metadata: Metadata = {
  title: "Students",
};

export default function AdminStudentsPage() {
  return (
    <AdminPlaceholder
      title="Students"
      description="Review student accounts and their registrations."
    />
  );
}
