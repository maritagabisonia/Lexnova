"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  COOKIE_NOTICE_MAX_AGE,
  COOKIE_NOTICE_NAME,
} from "@/lib/cookie-notice";

export function CookieNotice({ dismissed }: { dismissed: boolean }) {
  const t = useTranslations("cookie");
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
      aria-label={t("regionLabel")}
    >
      {/* PLACEHOLDER: This cookie notice should be reviewed by a lawyer before real launch. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm leading-relaxed text-paper/90">
          {t("body")}{" "}
          <Link href="/cookie-policy" className="underline hover:text-accent">
            {t("policyLink")}
          </Link>
          <span className="mt-1 block text-xs text-paper/70">
            {t("placeholder")}
          </span>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-sm bg-paper px-5 text-sm text-ink hover:bg-paper-muted"
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}
