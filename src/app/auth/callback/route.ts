import { NextResponse } from "next/server";
import { ensureStudentProfile } from "@/lib/ensure-student-profile";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(next: string | null) {
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fullName =
          typeof user.user_metadata?.full_name === "string"
            ? user.user_metadata.full_name.trim()
            : "";

        try {
          await ensureStudentProfile(supabase, {
            id: user.id,
            fullName,
            email: user.email ?? "",
          });
        } catch {
          // Profile may already exist via the signup trigger, or the
          // table may not be applied yet. Do not block sign-in either way.
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=reset`);
}
