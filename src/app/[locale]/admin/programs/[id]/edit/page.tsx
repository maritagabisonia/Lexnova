import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import {
  getAdminLecturers,
  getAdminProgram,
  getAdminProgramSessions,
} from "@/lib/admin-programs";
import { getAdminProgramRegistrations } from "@/lib/admin-registrations";
import { requireAdmin } from "@/lib/require-auth";
import { DeleteProgramButton } from "../../program-actions";
import {
  ProgramEditTabs,
  resolveProgramEditTab,
} from "../../program-edit-tabs";
import { ProgramForm } from "../../program-form";
import { ProgramSessions } from "../../program-sessions";
import { ProgramStudents } from "../../program-students";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    tab?: string;
    session?: string;
    registration?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("admin");
  const program = await getAdminProgram(id);
  return { title: program ? t("editNamed", { name: program.title || program.title_ka }) : t("editProgram") };
}

export default async function EditProgramPage({ params, searchParams }: Props) {
  const t = await getTranslations("admin");
  await requireAdmin();
  const { id } = await params;
  const query = await searchParams;
  const tab = resolveProgramEditTab(query);
  const [program, lecturers, sessions, registrations] = await Promise.all([
    getAdminProgram(id),
    getAdminLecturers(),
    getAdminProgramSessions(id),
    getAdminProgramRegistrations(id),
  ]);

  if (!program?.id) {
    notFound();
  }

  const sessionMessage =
    query.session === "added"
      ? t("sessionAdded")
      : query.session === "saved"
        ? t("sessionSaved")
        : query.session === "deleted"
          ? t("sessionDeleted")
          : undefined;
  const registrationMessage =
    query.registration === "added"
      ? t("studentAdded")
      : query.registration === "removed"
        ? t("studentRemoved")
        : undefined;

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/programs" className="text-ink-muted hover:text-accent">
          {t("programs")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("editProgram")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("editProgramLead")}
      </p>
      <ProgramEditTabs
        programId={program.id}
        current={tab}
        studentCount={registrations.length}
      />

      {tab === "program" ? (
        <>
          <ProgramForm mode="edit" lecturers={lecturers} program={program} />
          <DeleteProgramButton
            programId={program.id}
            title={program.title || program.title_ka}
          />
        </>
      ) : null}

      {tab === "sessions" ? (
        <ProgramSessions
          programId={program.id}
          programSlug={program.slug}
          programFormat={program.format}
          programLocation={program.location}
          programLecturerId={program.lecturer_id}
          lecturers={lecturers}
          sessions={sessions}
          notice={sessionMessage}
        />
      ) : null}

      {tab === "students" ? (
        <ProgramStudents
          programId={program.id}
          programSlug={program.slug}
          registrations={registrations}
          notice={registrationMessage}
        />
      ) : null}
    </section>
  );
}
