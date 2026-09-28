import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const seoKeys = [
  "home",
  "about",
  "programs",
  "news",
  "contact",
  "login",
  "register",
  "forgotPassword",
  "resetPassword",
  "notAuthorized",
  "privacyPolicy",
  "terms",
  "cookiePolicy",
  "notFound",
  "programFallback",
  "programNotFound",
  "articleNotFound",
  "myCourses",
  "calendar",
  "profile",
  "adminOverview",
] as const;

export type SeoKey = (typeof seoKeys)[number];

export async function seoMetadata(
  key: SeoKey,
  extras?: Metadata,
): Promise<Metadata> {
  const t = await getTranslations(`seo.${key}`);
  return {
    title: t("title"),
    description: t.has("description") ? t("description") : undefined,
    ...extras,
  };
}
