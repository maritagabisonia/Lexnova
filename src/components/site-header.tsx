"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authNav, primaryNav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="h-1 bg-accent" aria-hidden="true" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-serif text-2xl tracking-tight text-ink"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href={authNav[0].href}
            className="text-sm text-ink-muted transition-colors hover:text-accent"
          >
            {authNav[0].label}
          </Link>
          <Link
            href={authNav[1].href}
            className="rounded-sm bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-ink-muted"
          >
            {authNav[1].label}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm border border-ink/15 p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
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
          className="border-t border-ink/10 px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-3">
            {primaryNav.map((item) => {
              const current = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base ${current ? "text-ink" : "text-ink-muted"}`}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 flex items-center gap-4 border-t border-ink/10 pt-4">
              <Link
                href={authNav[0].href}
                className="text-sm text-ink-muted"
                onClick={() => setOpen(false)}
              >
                {authNav[0].label}
              </Link>
              <Link
                href={authNav[1].href}
                className="rounded-sm bg-ink px-4 py-2 text-sm text-paper"
                onClick={() => setOpen(false)}
              >
                {authNav[1].label}
              </Link>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
