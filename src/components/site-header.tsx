"use client";

import { Suspense, useState } from "react";
import { useTranslations } from "next-intl";
import { logout } from "@/app/auth/actions";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { isAdminPath, isDashboardPath } from "@/lib/auth-paths";
import { site } from "@/lib/site";

const primaryNav = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/programs", key: "programs" },
  { href: "/news", key: "news" },
  { href: "/contact", key: "contact" },
] as const;

export function SiteHeader({
  isLoggedIn,
  isAdmin = false,
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="h-1 bg-accent" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label={t("primary")}
        >
          {primaryNav.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-colors ${
                  current
                    ? "text-ink"
                    : "text-ink-muted hover:text-accent"
                }`}
                aria-current={current ? "page" : undefined}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
          <AuthControls isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-sm border border-ink/15 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? t("closeMenu") : t("openMenu")}</span>
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-ink/10 px-4 py-3 sm:px-6 md:hidden"
          aria-label={t("mobile")}
        >
          <div className="flex flex-col">
            {primaryNav.map((item) => {
              const current = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-11 items-center text-base ${
                    current ? "text-ink" : "text-ink-muted"
                  }`}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-3 border-t border-ink/10 pt-4">
              <Suspense>
                <LocaleSwitcher />
              </Suspense>
              <AuthControls isLoggedIn={isLoggedIn} isAdmin={isAdmin} stacked />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function AuthControls({
  isLoggedIn,
  isAdmin = false,
  stacked = false,
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  stacked?: boolean;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onDashboard = isDashboardPath(pathname);
  const onAdmin = isAdminPath(pathname);

  if (isLoggedIn) {
    return (
      <>
        {isAdmin ? (
          <Link
            href="/admin"
            className={
              stacked
                ? `flex min-h-11 items-center text-base ${
                    onAdmin ? "text-ink" : "text-ink-muted"
                  } transition-colors hover:text-accent`
                : `text-sm transition-colors hover:text-accent ${
                    onAdmin ? "text-ink" : "text-ink-muted"
                  }`
            }
            aria-current={onAdmin ? "page" : undefined}
          >
            {t("admin")}
          </Link>
        ) : null}
        <Link
          href="/dashboard"
          className={
            stacked
              ? `flex min-h-11 items-center text-base ${
                  onDashboard ? "text-ink" : "text-ink-muted"
                } transition-colors hover:text-accent`
              : `text-sm transition-colors hover:text-accent ${
                  onDashboard ? "text-ink" : "text-ink-muted"
                }`
          }
          aria-current={onDashboard ? "page" : undefined}
        >
          {t("dashboard")}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className={
              stacked
                ? "flex min-h-11 w-full items-center text-base text-ink-muted transition-colors hover:text-accent"
                : "text-sm text-ink-muted transition-colors hover:text-accent"
            }
          >
            {t("logOut")}
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={
          stacked
            ? "flex min-h-11 items-center text-base text-ink-muted transition-colors hover:text-accent"
            : "text-sm text-ink-muted transition-colors hover:text-accent"
        }
      >
        {t("login")}
      </Link>
      <Link
        href="/register"
        className={
          stacked
            ? "inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink-muted"
            : "rounded-sm bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-ink-muted"
        }
      >
        {t("register")}
      </Link>
    </>
  );
}
