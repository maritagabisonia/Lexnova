import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export const metadata: Metadata = {
  title: "Lecturers",
};

export default function AdminLecturersPage() {
  return (
    <AdminPlaceholder
      title="Lecturers"
      description="Manage lecturer profiles shown on public program pages."
    />
  );
}
