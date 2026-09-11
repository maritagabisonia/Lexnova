import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin-placeholder";

export const metadata: Metadata = {
  title: "Programs",
};

export default function AdminProgramsPage() {
  return (
    <AdminPlaceholder
      title="Programs"
      description="Create and edit courses and trainings from this list."
    />
  );
}
