"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav, isDashboardNavActive } from "@/lib/dashboard";

export function DashboardNav({
  variant,
}: {
  variant: "sidebar" | "tabs";
}) {
  const pathname = usePathname();

  if (variant === "tabs") {
    return (
      <nav
        className="grid grid-cols-3 border-b border-ink/10"
        aria-label="Dashboard"
      >
        {dashboardNav.map((item) => {
          const current = isDashboardNavActive(pathname, item.href);
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1 px-3" aria-label="Dashboard">
      {dashboardNav.map((item) => {
        const current = isDashboardNavActive(pathname, item.href);
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
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
