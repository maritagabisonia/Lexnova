import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdminLecturers,
  getAdminProgram,
  getAdminProgramSessions,
} from "@/lib/admin-programs";
import { DeleteProgramButton } from "../../program-actions";
import { ProgramForm } from "../../program-form";
import { ProgramSessions } from "../../program-sessions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session?: string }>;
};

const sessionMessages: Record<string, string> = {
  added: "Session added.",
  saved: "Session saved.",
  deleted: "Session deleted.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await getAdminProgram(id);
  return { title: program ? `Edit ${program.title}` : "Edit program" };
}

export default async function EditProgramPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { session: sessionResult } = await searchParams;
  const [program, lecturers, sessions] = await Promise.all([
    getAdminProgram(id),
    getAdminLecturers(),
    getAdminProgramSessions(id),
  ]);

  if (!program?.id) {
    notFound();
  }

  const sessionMessage = sessionResult ? sessionMessages[sessionResult] : undefined;

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
      <ProgramForm mode="edit" lecturers={lecturers} program={program} />
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
      <DeleteProgramButton programId={program.id} title={program.title} />
    </section>
  );
}
