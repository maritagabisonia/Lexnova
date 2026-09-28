import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export type ProgramEditTab = "program" | "sessions" | "students";

export function resolveProgramEditTab({
  tab,
  session,
  registration,
}: {
  tab?: string;
  session?: string;
  registration?: string;
}): ProgramEditTab {
  if (tab === "program" || tab === "sessions" || tab === "students") {
    return tab;
  }
  if (session) {
    return "sessions";
  }
  if (registration) {
    return "students";
  }
  return "program";
}

export async function ProgramEditTabs({
  programId,
  current,
  studentCount,
}: {
  programId: string;
  current: ProgramEditTab;
  studentCount: number;
}) {
  const t = await getTranslations("admin");
  const base = `/admin/programs/${programId}/edit`;
  const items = [
    { id: "program" as const, href: base, label: t("tabProgram") },
    { id: "sessions" as const, href: `${base}?tab=sessions`, label: t("tabSessions") },
    {
      id: "students" as const,
      href: `${base}?tab=students`,
      label: t("tabStudents", { count: studentCount }),
    },
  ];

  return (
    <nav
      className="mt-8 flex flex-wrap gap-1 border-b border-ink/10"
      aria-label={t("tabAria")}
    >
      {items.map((item) => {
        const active = current === item.id;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`inline-flex min-h-11 items-center px-3 text-sm ${
              active
                ? "border-b-2 border-ink text-ink"
                : "border-b-2 border-transparent text-ink-muted hover:text-accent"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
