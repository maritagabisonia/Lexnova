"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchTo(next: AppLocale) {
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label={t("switcherLabel")}
      className="inline-flex items-center rounded-sm border border-ink/15 text-sm"
    >
      {routing.locales.map((code) => {
        const current = locale === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={current}
            onClick={() => switchTo(code)}
            className={`inline-flex min-h-11 items-center px-3 ${
              current
                ? "bg-ink text-paper"
                : "text-ink-muted hover:text-accent"
            }`}
          >
            {t(code)}
          </button>
        );
      })}
    </div>
  );
}
