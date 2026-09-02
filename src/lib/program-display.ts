export type ProgramSummary = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  status: string;
  format: string;
  type: string;
  start_date: string | null;
  created_at: string;
};

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

export function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
