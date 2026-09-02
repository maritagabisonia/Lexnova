import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatDate,
  formatLabel,
  getProgramBySlug,
  statusLabel,
} from "@/lib/catalog";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  return { title: program?.title ?? "Program" };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-xs tracking-wide text-ink-muted">
        {statusLabel(program.status)} · {formatLabel(program.format)}
      </p>
      <h1 className="mt-3 text-3xl sm:text-5xl">{program.title}</h1>
      {program.start_date ? (
        <p className="mt-4 text-sm text-ink-muted">
          Starts {formatDate(program.start_date)}
          {program.duration_text ? ` · ${program.duration_text}` : ""}
        </p>
      ) : null}
      <p className="mt-8 text-base leading-relaxed text-ink-muted">
        {program.full_description ||
          program.short_description ||
          "Details for this program will be published soon."}
      </p>
      {program.location ? (
        <p className="mt-6 text-sm text-ink-muted">{program.location}</p>
      ) : null}
    </article>
  );
}
