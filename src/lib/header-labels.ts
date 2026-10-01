import { getTranslations } from "next-intl/server";
import { routing, type AppLocale } from "@/i18n/routing";

export const headerLabelKeys = [
  "home",
  "about",
  "programs",
  "news",
  "contact",
  "login",
  "register",
  "admin",
  "dashboard",
  "logOut",
  "account",
] as const;

export type HeaderLabelKey = (typeof headerLabelKeys)[number];
export type LocaleLabelMap = Record<AppLocale, string>;
export type HeaderLabels = Record<HeaderLabelKey, LocaleLabelMap>;

export async function getHeaderLabels(): Promise<HeaderLabels> {
  const translators = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => {
        const t = await getTranslations({ locale, namespace: "nav" });
        return [locale, t] as const;
      }),
    ),
  ) as Record<AppLocale, Awaited<ReturnType<typeof getTranslations>>>;

  return Object.fromEntries(
    headerLabelKeys.map((key) => [
      key,
      Object.fromEntries(
        routing.locales.map((locale) => [locale, translators[locale](key)]),
      ),
    ]),
  ) as HeaderLabels;
}
