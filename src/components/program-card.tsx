"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  formatDate,
  statusBadgeClass,
  translatedFormatLabel,
  translatedStatusLabel,
  translatedTypeLabel,
  typeBadgeClass,
  type ProgramSummary,
} from "@/lib/program-display";

export function ProgramCard({ program }: { program: ProgramSummary }) {
  const t = useTranslations("programs");
  const locale = useLocale();
  const start = program.start_date
    ? formatDate(program.start_date, locale)
    : null;

  return (
    <article className="flex h-full flex-col border border-ink/10 bg-paper p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${typeBadgeClass(program.type)}`}
        >
          {translatedTypeLabel(program.type, t)}
        </span>
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${statusBadgeClass(program.status)}`}
        >
          {translatedStatusLabel(program.status, t)}
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
        <p className="mt-3 flex-1 text-sm text-ink-muted">{t("detailsSoon")}</p>
      )}
      {program.status === "coming_soon" ? null : (
        <p className="mt-4 text-xs text-ink-muted">
          {translatedFormatLabel(program.format, t)}
          {start
            ? ` · ${t("starts", { date: start })}`
            : ` · ${t("datesTba")}`}
        </p>
      )}
      <Link
        href={`/programs/${program.slug}`}
        className="mt-5 inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
      >
        {t("viewProgram")}
      </Link>
    </article>
  );
}
