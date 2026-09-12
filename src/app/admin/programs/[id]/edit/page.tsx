import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminLecturers,
  getAdminProgram,
  getAdminProgramSessions,
} from "@/lib/admin-programs";
import { getAdminProgramRegistrations } from "@/lib/admin-registrations";
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

const sessionMessages: Record<string, string> = {
  added: "Session added.",
  saved: "Session saved.",
  deleted: "Session deleted.",
};

const registrationMessages: Record<string, string> = {
  added: "Student added.",
  removed: "Student removed.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await getAdminProgram(id);
  return { title: program ? `Edit ${program.title}` : "Edit program" };
}

export default async function EditProgramPage({ params, searchParams }: Props) {
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

  const sessionMessage = query.session ? sessionMessages[query.session] : undefined;
  const registrationMessage = query.registration
    ? registrationMessages[query.registration]
    : undefined;

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/programs" className="text-ink-muted hover:text-accent">
          Programs
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Edit program</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Update this course or training. Change status to Archived to hide it
        from the public catalog without deleting the row.
      </p>
      <ProgramEditTabs
        programId={program.id}
        current={tab}
        studentCount={registrations.length}
      />

      {tab === "program" ? (
        <>
          <ProgramForm mode="edit" lecturers={lecturers} program={program} />
          <DeleteProgramButton programId={program.id} title={program.title} />
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
