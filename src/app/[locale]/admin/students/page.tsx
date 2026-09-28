import { getTranslations } from "next-intl/server";
import { AdminPlaceholder } from "@/components/admin-placeholder";
import { requireAdmin } from "@/lib/require-auth";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("students") };
}

export default async function AdminStudentsPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  return (
    <AdminPlaceholder
      title={t("students")}
      description={t("studentsLead")}
    />
  );
}
