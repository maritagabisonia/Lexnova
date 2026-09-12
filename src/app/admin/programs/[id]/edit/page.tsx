import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminLecturers, getAdminProgram } from "@/lib/admin-programs";
import { DeleteProgramButton } from "../../program-actions";
import { ProgramForm } from "../../program-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const program = await getAdminProgram(id);
  return { title: program ? `Edit ${program.title}` : "Edit program" };
}

export default async function EditProgramPage({ params }: Props) {
  const { id } = await params;
  const [program, lecturers] = await Promise.all([
    getAdminProgram(id),
    getAdminLecturers(),
  ]);

  if (!program?.id) {
    notFound();
  }

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
      <DeleteProgramButton programId={program.id} title={program.title} />
    </section>
  );
}
