import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  emptyProgramFormValues,
  getAdminLecturers,
} from "@/lib/admin-programs";
import { requireAdmin } from "@/lib/require-auth";
import { ProgramForm } from "../program-form";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("newProgram") };
}

export default async function NewProgramPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  const lecturers = await getAdminLecturers();

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/programs" className="text-ink-muted hover:text-accent">
          {t("programs")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("newProgram")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("newProgramLead")}
      </p>
      <ProgramForm
        mode="create"
        lecturers={lecturers}
        program={emptyProgramFormValues}
      />
    </section>
  );
}
