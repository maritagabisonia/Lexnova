"use server";

import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/redirect";
import { getProgramBySlug } from "@/lib/catalog";
import { isRegistrationDeadlineOpen } from "@/lib/program-display";
import { revalidateLocalized } from "@/lib/revalidate";
import { createClient } from "@/lib/supabase/server";

export type ProgramRegisterState = {
  error?: string;
  success?: string;
  code?: "alreadyRegistered" | "fullyBooked";
};

export async function registerForProgram(
  _prev: ProgramRegisterState,
  formData: FormData,
): Promise<ProgramRegisterState> {
  const t = await getTranslations("programs.errors");
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug || !/^[a-z0-9-]{1,80}$/.test(slug)) {
    return { error: t("notFound") };
  }

  const returnPath = `/programs/${slug}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }

  const program = await getProgramBySlug(slug);
  if (!program) {
    return { error: t("notInCatalog") };
  }

  if (program.status !== "registration_open") {
    return { error: t("notOpen") };
  }

  if (!isRegistrationDeadlineOpen(program.registration_deadline)) {
    return { error: t("closed") };
  }

  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id")
    .eq("program_id", program.id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (existingError) {
    console.error("Registration lookup failed:", existingError);
    return { error: t("generic") };
  }

  if (existing) {
    return { code: "alreadyRegistered" };
  }

  if (program.max_participants) {
    const { data: count, error: countError } = await supabase.rpc(
      "confirmed_registration_count",
      { p_program_id: program.id },
    );

    if (countError || count == null) {
      console.error("Registration count failed:", countError);
      return { error: t("generic") };
    }

    if (Number(count) >= program.max_participants) {
      return { code: "fullyBooked" };
    }
  }

  const { error } = await supabase.from("registrations").insert({
    program_id: program.id,
    student_id: user.id,
    status: "confirmed",
  });

  if (error) {
    if (error.code === "23505") {
      return { code: "alreadyRegistered" };
    }
    console.error("Registration insert failed:", error);
    return { error: t("generic") };
  }

  revalidateLocalized(returnPath);
  revalidateLocalized("/dashboard");
  revalidateLocalized("/dashboard/courses");
  revalidateLocalized("/dashboard/calendar");
  return { success: t("success", { title: program.title }) };
}
