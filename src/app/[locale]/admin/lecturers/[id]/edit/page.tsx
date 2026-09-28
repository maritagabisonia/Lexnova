import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAdminLecturer } from "@/lib/admin-lecturers";
import { requireAdmin } from "@/lib/require-auth";
import { LecturerForm } from "../../lecturer-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("admin");
  const lecturer = await getAdminLecturer(id);
  return {
    title: lecturer
      ? t("editNamed", { name: lecturer.full_name })
      : t("editLecturer"),
  };
}

export default async function EditLecturerPage({ params }: Props) {
  const t = await getTranslations("admin");
  await requireAdmin();
  const { id } = await params;
  const lecturer = await getAdminLecturer(id);
  if (!lecturer?.id) {
    notFound();
  }

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/lecturers" className="text-ink-muted hover:text-accent">
          {t("lecturers")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("editLecturer")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("editLecturerLead")}
      </p>
      <LecturerForm mode="edit" lecturer={lecturer} />
    </section>
  );
}
