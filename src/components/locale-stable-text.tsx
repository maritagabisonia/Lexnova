"use client";

import { useLocale } from "next-intl";
import { routing, type AppLocale } from "@/i18n/routing";
import type { LocaleLabelMap } from "@/lib/header-labels";

export function LocaleStableText({
  labels,
  align = "center",
}: {
  labels: LocaleLabelMap;
  align?: "center" | "start";
}) {
  const locale = useLocale() as AppLocale;

  return (
    <span
      className={`inline-grid ${
        align === "start" ? "justify-items-start" : "justify-items-center"
      }`}
    >
      {routing.locales.map((code) => {
        const current = code === locale;
        return (
          <span
            key={code}
            className={`col-start-1 row-start-1 whitespace-nowrap ${
              current ? "" : "invisible"
            }`}
            aria-hidden={current ? undefined : true}
          >
            {labels[code]}
          </span>
        );
      })}
    </span>
  );
}
