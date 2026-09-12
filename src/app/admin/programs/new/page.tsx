import type { Metadata } from "next";
import Link from "next/link";
import {
  emptyProgramFormValues,
  getAdminLecturers,
} from "@/lib/admin-programs";
import { ProgramForm } from "../program-form";

export const metadata: Metadata = {
  title: "New Program",
};

export default async function NewProgramPage() {
  const lecturers = await getAdminLecturers();

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/programs" className="text-ink-muted hover:text-accent">
          Programs
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">New Program</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Add a course or training to the catalog. The slug is generated from the
        title and can be edited.
      </p>
      <ProgramForm
        mode="create"
        lecturers={lecturers}
        program={emptyProgramFormValues}
      />
    </section>
  );
}
