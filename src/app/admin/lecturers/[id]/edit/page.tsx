import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminLecturer } from "@/lib/admin-lecturers";
import { LecturerForm } from "../../lecturer-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lecturer = await getAdminLecturer(id);
  return { title: lecturer ? `Edit ${lecturer.full_name}` : "Edit lecturer" };
}

export default async function EditLecturerPage({ params }: Props) {
  const { id } = await params;
  const lecturer = await getAdminLecturer(id);
  if (!lecturer?.id) {
    notFound();
  }

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/lecturers" className="text-ink-muted hover:text-accent">
          Lecturers
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">Edit lecturer</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Update this profile. Changes appear on public program pages and in the
        program lecturer dropdown.
      </p>
      <LecturerForm mode="edit" lecturer={lecturer} />
    </section>
  );
}
