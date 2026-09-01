import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureStudentProfile(
  supabase: SupabaseClient,
  input: { id: string; fullName: string; email: string },
) {
  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", input.id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existing) {
    return;
  }

  const { error } = await supabase.from("profiles").insert({
    id: input.id,
    full_name: input.fullName || "Student",
    email: input.email,
    role: "student",
  });

  if (error) {
    const details = `${error.code ?? ""} ${error.message}`.toLowerCase();
    if (details.includes("duplicate") || error.code === "23505") {
      return;
    }
    throw error;
  }
}
