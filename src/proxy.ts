import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { isAppLocale } from "./i18n/path";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth callback stays unprefixed so Supabase redirect URLs keep working.
  if (pathname.startsWith("/auth/")) {
    return updateSession(request);
  }

  // next-intl with localeDetection: false always sends `/` to the default
  // locale. Restore a previously chosen language from the cookie instead.
  if (pathname === "/") {
    const saved = request.cookies.get("NEXT_LOCALE")?.value;
    if (isAppLocale(saved) && saved !== routing.defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = `/${saved}`;
      return updateSession(request, NextResponse.redirect(url));
    }
  }

  const i18nResponse = handleI18nRouting(request);
  return updateSession(request, i18nResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
