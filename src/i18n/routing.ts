import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ka", "en"],
  defaultLocale: "ka",
  localePrefix: "always",
  // First visit to `/` goes to Georgian. A language switch still sets a cookie
  // so later visits to `/` restore the chosen locale.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
