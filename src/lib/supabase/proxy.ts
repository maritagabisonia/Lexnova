import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  localeFromPathname,
  stripLocalePrefix,
  withLocalePrefix,
} from "@/i18n/path";
import { isAdminPath, isDashboardPath } from "@/lib/auth-paths";

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value, ...options }) => {
    to.cookies.set(name, value, options);
  });
  return to;
}

export async function updateSession(
  request: NextRequest,
  response?: NextResponse,
) {
  let supabaseResponse =
    response ??
    NextResponse.next({
      request,
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          if (!response) {
            supabaseResponse = NextResponse.next({
              request,
            });
          }
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const locale = localeFromPathname(pathname);
  const pathWithoutLocale = stripLocalePrefix(pathname);
  const needsAuth =
    isDashboardPath(pathWithoutLocale) || isAdminPath(pathWithoutLocale);

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePrefix("/login", locale);
    url.search = "";
    return copyCookies(supabaseResponse, NextResponse.redirect(url));
  }

  if (isAdminPath(pathWithoutLocale) && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = withLocalePrefix("/not-authorized", locale);
      url.search = "";
      return copyCookies(supabaseResponse, NextResponse.redirect(url));
    }
  }

  return supabaseResponse;
}
