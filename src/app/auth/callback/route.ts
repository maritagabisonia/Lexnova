import { NextResponse } from "next/server";
import { localeFromPathname, withLocalePrefix } from "@/i18n/path";
import { routing } from "@/i18n/routing";
import { safeNextPath } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const cookieLocale = request.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)NEXT_LOCALE=(ka|en)(?:;|$)/)?.[1];
  const locale =
    cookieLocale === "en" || cookieLocale === "ka"
      ? cookieLocale
      : localeFromPathname(next) || routing.defaultLocale;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${withLocalePrefix(next, locale)}`);
    }
  }

  return NextResponse.redirect(
    `${origin}${withLocalePrefix("/login", locale)}?error=reset`,
  );
}
