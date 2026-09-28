import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ka", "en"],
  defaultLocale: "ka",
  localePrefix: "always",
  // Do not sniff Accept-Language. First visit to `/` is Georgian; after a
  // switch, `/` restores the NEXT_LOCALE cookie (see src/proxy.ts).
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
