"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  COOKIE_NOTICE_MAX_AGE,
  COOKIE_NOTICE_NAME,
} from "@/lib/cookie-notice";

export function CookieNotice({ dismissed }: { dismissed: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(!dismissed);

  if (!open) {
    return null;
  }

  function dismiss() {
    const secure =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `${COOKIE_NOTICE_NAME}=1; Path=/; Max-Age=${COOKIE_NOTICE_MAX_AGE}; SameSite=Lax${secure}`;
    setOpen(false);
    router.refresh();
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/40 bg-ink text-paper"
      role="region"
      aria-label="Cookie notice"
    >
      {/* PLACEHOLDER: This cookie notice should be reviewed by a lawyer before real launch. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm leading-relaxed text-paper/90">
          We use essential cookies to keep you signed in, and a small
          preference cookie if you dismiss this notice. We do not currently
          use advertising or analytics cookies.{" "}
          <Link href="/cookie-policy" className="underline hover:text-accent">
            Cookie policy
          </Link>
          <span className="mt-1 block text-xs text-paper/70">
            Placeholder notice — review with a lawyer before launch.
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-paper px-5 text-sm text-ink hover:bg-paper-muted"
        >
          OK
        </button>
      </div>
    </div>
  );
}
