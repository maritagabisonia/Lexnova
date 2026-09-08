import type { Metadata } from "next";
import { site } from "@/lib/site";

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

/** Canonical origin for sitemap, robots, and metadataBase. */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(explicit);
  }

  const isProd = process.env.VERCEL_ENV === "production";
  const host = isProd
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    : process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (host) {
    const hostname = stripTrailingSlash(host).replace(/^https?:\/\//, "");
    return `https://${hostname}`;
  }

  return "http://localhost:3000";
}

export function descriptionFromFields(
  ...candidates: Array<string | null | undefined>
) {
  for (const candidate of candidates) {
    const text = candidate?.replace(/\s+/g, " ").trim();
    if (!text) {
      continue;
    }
    if (text.length <= 160) {
      return text;
    }
    return `${text.slice(0, 157).trimEnd()}…`;
  }
  return undefined;
}

export const publicPages = {
  home: {
    title: { absolute: site.name },
    description:
      "LexNova offers courses and training for lawyers, civic advocates, and anyone who needs a clearer map of the law — taught by practitioners.",
  },
  about: {
    title: "About",
    description:
      "LexNova is a center for legal education. We teach lawyers, civic advocates, and members of the public who need a clearer map of the law.",
  },
  programs: {
    title: "Programs",
    description:
      "Browse LexNova courses and training — filter by type, format, and registration status.",
  },
  news: {
    title: "News",
    description:
      "Notes from LexNova on programs, teaching, and public legal education.",
  },
  contact: {
    title: "Contact",
    description:
      "Write to LexNova about programs, group bookings, or a question about your registration.",
  },
  login: {
    title: "Log in",
    description:
      "Log in to your LexNova account to register for programs and manage your profile.",
  },
  register: {
    title: "Register",
    description:
      "Create a LexNova student account to register for courses and training.",
  },
  forgotPassword: {
    title: "Forgot password",
    description: "Request a password reset link for your LexNova account.",
  },
  resetPassword: {
    title: "Reset password",
    description: "Choose a new password for your LexNova account.",
  },
  notAuthorized: {
    title: "Not authorized",
    description: "You do not have permission to view that page.",
  },
} as const satisfies Record<string, Metadata>;

export const publicSitemapPaths = [
  "/",
  "/about",
  "/programs",
  "/news",
  "/contact",
] as const;
