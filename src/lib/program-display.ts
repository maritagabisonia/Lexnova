import { calendarIntlLocale, intlLocale } from "@/i18n/dates";
import { localizedText } from "@/lib/localized-content";

export type ProgramSummary = {
  id: string;
  title: string;
  title_en?: string | null;
  title_ka?: string | null;
  slug: string;
  short_description: string | null;
  short_description_en?: string | null;
  short_description_ka?: string | null;
  status: string;
  format: string;
  type: string;
  start_date: string | null;
  created_at: string;
};

export type ProgramContentRow = {
  id: string;
  title: string | null;
  title_ka?: string | null;
  slug: string;
  short_description: string | null;
  short_description_ka?: string | null;
  status: string;
  format: string;
  type: string;
  start_date: string | null;
  created_at: string;
};

function trimmedOrNull(value: string | null | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

export function toProgramSummary(row: ProgramContentRow, locale: string): ProgramSummary {
  return {
    id: row.id,
    title: localizedText(locale, row.title_ka, row.title) ?? "",
    title_en: trimmedOrNull(row.title),
    title_ka: trimmedOrNull(row.title_ka),
    slug: row.slug,
    short_description: localizedText(
      locale,
      row.short_description_ka,
      row.short_description,
    ),
    short_description_en: trimmedOrNull(row.short_description),
    short_description_ka: trimmedOrNull(row.short_description_ka),
    status: row.status,
    format: row.format,
    type: row.type,
    start_date: row.start_date,
    created_at: row.created_at,
  };
}

export function programMatchesQuery(program: ProgramSummary, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = [
    program.title,
    program.title_en,
    program.title_ka,
    program.short_description,
    program.short_description_en,
    program.short_description_ka,
  ]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();
  return haystack.includes(needle);
}

export function pickUpcomingPrograms(
  programs: ProgramSummary[],
  today: string,
  limit = 5,
) {
  const dated: ProgramSummary[] = [];
  const undated: ProgramSummary[] = [];
  for (const program of programs) {
    if (program.start_date && program.start_date >= today) {
      dated.push(program);
    } else if (!program.start_date && program.status === "coming_soon") {
      undated.push(program);
    }
  }
  dated.sort((a, b) => (a.start_date ?? "").localeCompare(b.start_date ?? ""));
  undated.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return [...dated, ...undated].slice(0, limit);
}

export function localizedProgramLabel(
  locale: string,
  titleKa: string | null | undefined,
  titleEn: string | null | undefined,
  fallback: string,
) {
  return localizedText(locale, titleKa, titleEn) ?? fallback;
}

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    registration_open: "Registration open",
    coming_soon: "Coming soon",
    fully_booked: "Fully booked",
    in_progress: "In progress",
    completed: "Completed",
    archived: "Archived",
  };
  return labels[status] ?? status.replaceAll("_", " ");
}

export function formatLabel(format: string) {
  const labels: Record<string, string> = {
    online: "Online",
    in_person: "In person",
    hybrid: "Hybrid",
  };
  return labels[format] ?? format.replaceAll("_", " ");
}

export function typeLabel(type: string) {
  const labels: Record<string, string> = {
    course: "Course",
    training: "Training",
  };
  return labels[type] ?? type.replaceAll("_", " ");
}

export const programTypeFilters = [
  { value: "course", label: "Course" },
  { value: "training", label: "Training" },
] as const;

export const programFormatFilters = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export const programStatusFilters = [
  { value: "registration_open", label: "Registration open" },
  { value: "coming_soon", label: "Coming soon" },
  { value: "fully_booked", label: "Fully booked" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
] as const;

export function statusBadgeClass(status: string) {
  const classes: Record<string, string> = {
    registration_open: "border-transparent bg-accent text-ink",
    coming_soon: "border-ink/15 bg-paper-muted text-ink",
    fully_booked: "border-transparent bg-ink text-paper",
    in_progress: "border-transparent bg-ink-muted text-paper",
    completed: "border-ink/20 bg-transparent text-ink-muted",
    archived: "border-ink/10 bg-transparent text-ink-muted",
  };
  return classes[status] ?? "border-ink/15 bg-paper-muted text-ink";
}

export function typeBadgeClass(type: string) {
  return type === "training"
    ? "border-accent/60 bg-transparent text-ink"
    : "border-ink/20 bg-transparent text-ink";
}

export function formatDate(value: string | null, locale = "en") {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/** Month and day only, e.g. "September 15". */
export function formatCalendarDate(value: string | null, locale = "en") {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat(calendarIntlLocale(locale), {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function translatedTypeLabel(
  type: string,
  t: (key: "typeCourse" | "typeTraining") => string,
) {
  if (type === "course") return t("typeCourse");
  if (type === "training") return t("typeTraining");
  return typeLabel(type);
}

export function translatedFormatLabel(
  format: string,
  t: (key: "formatOnline" | "formatInPerson" | "formatHybrid") => string,
) {
  if (format === "online") return t("formatOnline");
  if (format === "in_person") return t("formatInPerson");
  if (format === "hybrid") return t("formatHybrid");
  return formatLabel(format);
}

export function translatedStatusLabel(
  status: string,
  t: (
    key:
      | "statusRegistrationOpen"
      | "statusComingSoon"
      | "statusFullyBooked"
      | "statusInProgress"
      | "statusCompleted"
      | "statusArchived",
  ) => string,
) {
  const keys: Record<
    string,
    | "statusRegistrationOpen"
    | "statusComingSoon"
    | "statusFullyBooked"
    | "statusInProgress"
    | "statusCompleted"
    | "statusArchived"
  > = {
    registration_open: "statusRegistrationOpen",
    coming_soon: "statusComingSoon",
    fully_booked: "statusFullyBooked",
    in_progress: "statusInProgress",
    completed: "statusCompleted",
    archived: "statusArchived",
  };
  const key = keys[status];
  return key ? t(key) : statusLabel(status);
}

export function formatTime(value: string | null) {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(":");
  if (hours == null || minutes == null) {
    return value;
  }

  return `${hours.padStart(2, "0")}:${minutes.slice(0, 2).padStart(2, "0")}`;
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

/** Deadline day is still open. No deadline means registration is not time-limited. */
export function isRegistrationDeadlineOpen(deadline: string | null) {
  if (!deadline) {
    return true;
  }
  return todayIsoDate() <= deadline;
}
