import type { Metadata } from "next";
import Link from "next/link";
import { emptyLecturerFormValues } from "@/lib/admin-lecturers";
import { LecturerForm } from "../lecturer-form";

export const metadata: Metadata = {
  title: "New Lecturer",
};

export default function NewLecturerPage() {
  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/lecturers" className="text-ink-muted hover:text-accent">
          Lecturers
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">New Lecturer</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Add a lecturer profile. They will appear in the program lecturer
        dropdown.
      </p>
      <LecturerForm mode="create" lecturer={emptyLecturerFormValues} />
    </section>
  );
}
