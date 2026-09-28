import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/** Revalidate a pathname for every locale prefix (and the unprefixed form). */
export function revalidateLocalized(
  path: string,
  type?: "page" | "layout",
) {
  const normalized = path === "/" ? "" : path;
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${normalized}`, type);
  }
  revalidatePath(path, type);
}
