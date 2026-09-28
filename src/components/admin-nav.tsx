"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { adminNav, isAdminNavActive } from "@/lib/admin";

const navKeys = {
  "/admin": "overview",
  "/admin/programs": "programs",
  "/admin/news": "news",
  "/admin/lecturers": "lecturers",
  "/admin/students": "students",
  "/admin/users": "users",
} as const;

export function AdminNav({ variant }: { variant: "sidebar" | "tabs" }) {
  const t = useTranslations("admin");
  const pathname = usePathname();

  if (variant === "tabs") {
    return (
      <nav
        className="grid grid-cols-3 border-b border-ink/10"
        aria-label={t("navAria")}
      >
        {adminNav.map((item) => {
          const current = isAdminNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 items-center justify-center px-2 text-center text-sm ${
                current
                  ? "border-b-2 border-ink text-ink"
                  : "border-b-2 border-transparent text-ink-muted hover:text-accent"
              }`}
              aria-current={current ? "page" : undefined}
            >
              {t(navKeys[item.href])}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label={t("navAria")}>
      {adminNav.map((item) => {
        const current = isAdminNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-11 items-center border-l-2 px-3 text-sm ${
              current
                ? "border-ink bg-paper-muted text-ink"
                : "border-transparent text-ink-muted hover:text-accent"
            }`}
            aria-current={current ? "page" : undefined}
          >
            {t(navKeys[item.href])}
          </Link>
        );
      })}
    </nav>
  );
}
