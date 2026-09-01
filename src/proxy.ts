import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 runs `src/proxy.ts` on every matched request (this replaced
// `middleware.ts`). Session refresh and /dashboard + /admin redirects live here.
// Layouts under those routes repeat the same checks so a missed matcher
// still cannot render the page.

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
