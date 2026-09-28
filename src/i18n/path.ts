import { routing, type AppLocale } from "./routing";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return value === "ka" || value === "en";
}

export function localeFromPathname(pathname: string): AppLocale {
  const first = pathname.split("/")[1];
  return isAppLocale(first) ? first : routing.defaultLocale;
}

export function stripLocalePrefix(pathname: string) {
  const first = pathname.split("/")[1];
  if (!isAppLocale(first)) {
    return pathname;
  }
  const rest = pathname.slice(first.length + 1);
  return rest === "" ? "/" : rest;
}

export function withLocalePrefix(pathname: string, locale: AppLocale) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}
