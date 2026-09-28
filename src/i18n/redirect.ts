import { getLocale } from "next-intl/server";
import { redirect as nextRedirect } from "next/navigation";
import { withLocalePrefix } from "./path";
import type { AppLocale } from "./routing";

/** Locale-prefixed redirect that TypeScript treats as `never`. */
export async function redirect(href: string): Promise<never> {
  const locale = (await getLocale()) as AppLocale;
  const [path, query] = href.split("?");
  const localized = withLocalePrefix(path || "/", locale);
  nextRedirect(query ? `${localized}?${query}` : localized);
}
