import type { Metadata } from "next";
import { ProgramCard } from "@/components/program-card";
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
  const programs = await getPrograms(type);
  const trainingOnly = type === "training";

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-5xl">
        {trainingOnly ? "Training" : "Programs"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
        {trainingOnly
          ? "Short, intensive trainings for practicing lawyers and staff."
          : "Courses and trainings currently offered by LexNova."}
      </p>
      {programs.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-ink-muted">
          No programs are listed yet.
        </p>
      )}
    </section>
  );
}
