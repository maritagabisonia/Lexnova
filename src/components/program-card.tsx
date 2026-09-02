import Link from "next/link";
import {
  formatDate,
  formatLabel,
  statusBadgeClass,
  statusLabel,
  typeBadgeClass,
  typeLabel,
  type ProgramSummary,
} from "@/lib/program-display";

export function ProgramCard({ program }: { program: ProgramSummary }) {
  return (
    <article className="flex h-full flex-col border border-ink/10 bg-paper p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${typeBadgeClass(program.type)}`}
        >
          {typeLabel(program.type)}
        </span>
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${statusBadgeClass(program.status)}`}
        >
          {statusLabel(program.status)}
        </span>
      </div>
      <h3 className="mt-4 text-xl">
        <Link href={`/programs/${program.slug}`} className="hover:text-accent">
          {program.title}
        </Link>
      </h3>
      {program.short_description ? (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
          {program.short_description}
        </p>
      ) : (
        <p className="mt-3 flex-1 text-sm text-ink-muted">Details coming soon.</p>
      )}
      <p className="mt-4 text-xs text-ink-muted">
        {formatLabel(program.format)}
        {program.start_date
          ? ` · Starts ${formatDate(program.start_date)}`
          : " · Dates to be announced"}
      </p>
      <Link
        href={`/programs/${program.slug}`}
        className="mt-5 text-sm text-ink hover:text-accent"
      >
        View program
      </Link>
    </article>
  );
}
