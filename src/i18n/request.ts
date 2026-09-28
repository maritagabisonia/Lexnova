import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale, locale }) => {
  let resolved = locale;
  if (!resolved) {
    const requested = await requestLocale;
    resolved = hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale;
  }

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
