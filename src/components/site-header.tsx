"use client";

import { Suspense, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { logout } from "@/app/auth/actions";
import { LocaleStableText } from "@/components/locale-stable-text";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { isAdminPath, isDashboardPath } from "@/lib/auth-paths";
import type { HeaderLabels } from "@/lib/header-labels";
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
  labels,
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  labels: HeaderLabels;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur [--text-sm:0.875rem] [--text-base:1rem] [--text-2xl:1.5rem] [--tracking-tight:-0.025em]">
      <div className="h-1 bg-accent" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center gap-10 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="shrink-0"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt={site.name}
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            preload
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-start gap-8 lg:flex"
          aria-label={t("primary")}
        >
          {primaryNav.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-sm tracking-wide transition-colors ${
                  current
                    ? "text-ink"
                    : "text-ink-muted hover:text-accent"
                }`}
                aria-current={current ? "page" : undefined}
              >
                <LocaleStableText labels={labels[item.key]} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <span className="h-6 w-px shrink-0 bg-ink/15" aria-hidden="true" />
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
          {isLoggedIn ? (
            <AccountMenu isAdmin={isAdmin} labels={labels} />
          ) : (
            <GuestControls labels={labels} />
          )}
        </div>

        <button
          type="button"
          className="ml-auto inline-flex size-11 items-center justify-center rounded-sm border border-ink/15 text-ink lg:hidden"
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
          className="border-t border-ink/10 px-4 py-3 sm:px-6 lg:hidden"
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
                  <LocaleStableText align="start" labels={labels[item.key]} />
                </Link>
              );
            })}
            <div className="mt-2 flex flex-col gap-4 border-t border-ink/10 pt-4">
              <Suspense>
                <LocaleSwitcher />
              </Suspense>
              {isLoggedIn ? (
                <AccountMenu
                  isAdmin={isAdmin}
                  labels={labels}
                  stacked
                  onNavigate={() => setOpen(false)}
                />
              ) : (
                <GuestControls
                  labels={labels}
                  stacked
                  onNavigate={() => setOpen(false)}
                />
              )}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

function GuestControls({
  labels,
  stacked = false,
  onNavigate,
}: {
  labels: HeaderLabels;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div
      className={
        stacked
          ? "flex flex-col gap-2"
          : "flex items-center gap-4"
      }
    >
      <Link
        href="/login"
        onClick={onNavigate}
        className={
          stacked
            ? "flex min-h-11 items-center text-base text-ink-muted transition-colors hover:text-accent"
            : "text-sm text-ink-muted transition-colors hover:text-accent"
        }
      >
        <LocaleStableText
          align={stacked ? "start" : "center"}
          labels={labels.login}
        />
      </Link>
      <Link
        href="/register"
        onClick={onNavigate}
        className={
          stacked
            ? "inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink-muted"
            : "inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink-muted"
        }
      >
        <LocaleStableText labels={labels.register} />
      </Link>
    </div>
  );
}

function AccountMenu({
  isAdmin,
  labels,
  stacked = false,
  onNavigate,
}: {
  isAdmin: boolean;
  labels: HeaderLabels;
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onDashboard = isDashboardPath(pathname);
  const onAdmin = isAdminPath(pathname);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const items = (
    <>
      {isAdmin ? (
        <Link
          href="/admin"
          role={stacked ? undefined : "menuitem"}
          onClick={() => {
            setOpen(false);
            onNavigate?.();
          }}
          className={
            stacked
              ? `flex min-h-11 items-center text-base transition-colors hover:text-accent ${
                  onAdmin ? "text-ink" : "text-ink-muted"
                }`
              : `flex min-h-11 items-center px-3 text-sm transition-colors hover:bg-paper-muted hover:text-accent ${
                  onAdmin ? "text-ink" : "text-ink-muted"
                }`
          }
          aria-current={onAdmin ? "page" : undefined}
        >
          <LocaleStableText
            align="start"
            labels={labels.admin}
          />
        </Link>
      ) : null}
      <Link
        href="/dashboard"
        role={stacked ? undefined : "menuitem"}
        onClick={() => {
          setOpen(false);
          onNavigate?.();
        }}
        className={
          stacked
            ? `flex min-h-11 items-center text-base transition-colors hover:text-accent ${
                onDashboard ? "text-ink" : "text-ink-muted"
              }`
            : `flex min-h-11 items-center px-3 text-sm transition-colors hover:bg-paper-muted hover:text-accent ${
                onDashboard ? "text-ink" : "text-ink-muted"
              }`
        }
        aria-current={onDashboard ? "page" : undefined}
      >
        <LocaleStableText align="start" labels={labels.dashboard} />
      </Link>
      <form action={logout} className={stacked ? undefined : "border-t border-ink/10"}>
        <button
          type="submit"
          role={stacked ? undefined : "menuitem"}
          className={
            stacked
              ? "flex min-h-11 w-full items-center text-base text-ink-muted transition-colors hover:text-accent"
              : "flex min-h-11 w-full items-center px-3 text-sm text-ink-muted transition-colors hover:bg-paper-muted hover:text-accent"
          }
        >
          <LocaleStableText align="start" labels={labels.logOut} />
        </button>
      </form>
    </>
  );

  if (stacked) {
    return (
      <div className="flex flex-col gap-1">
        <p className="text-xs tracking-wide text-ink-muted">
          <LocaleStableText align="start" labels={labels.account} />
        </p>
        {items}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={t("accountMenu")}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-ink/15 px-3 text-sm text-ink transition-colors hover:border-ink/30"
      >
        <LocaleStableText labels={labels.account} />
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-1 min-w-48 rounded-sm border border-ink/15 bg-paper py-1 shadow-sm"
        >
          {items}
        </div>
      ) : null}
    </div>
  );
}
