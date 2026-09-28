import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { emptyLecturerFormValues } from "@/lib/admin-lecturers";
import { requireAdmin } from "@/lib/require-auth";
import { LecturerForm } from "../lecturer-form";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("newLecturer") };
}

export default async function NewLecturerPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/lecturers" className="text-ink-muted hover:text-accent">
          {t("lecturers")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("newLecturer")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("newLecturerLead")}
      </p>
      <LecturerForm mode="create" lecturer={emptyLecturerFormValues} />
    </section>
  );
}
