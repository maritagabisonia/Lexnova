import type { Metadata } from "next";
import { ProgramsCatalog } from "@/components/programs-catalog";
import { getPrograms } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Programs",
};

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const programs = await getPrograms();

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-5xl">Programs</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
        Courses and trainings currently offered by LexNova.
      </p>
      <ProgramsCatalog programs={programs} initialType={type} />
    </section>
  );
}
