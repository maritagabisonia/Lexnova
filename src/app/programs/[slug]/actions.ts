"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProgramBySlug } from "@/lib/catalog";
import { isRegistrationDeadlineOpen } from "@/lib/program-display";
import {
  ALREADY_REGISTERED_MESSAGE,
  FULLY_BOOKED_MESSAGE,
  registrationSuccessMessage,
} from "@/lib/program-register";
import { createClient } from "@/lib/supabase/server";

export type ProgramRegisterState = {
  error?: string;
  success?: string;
};

export async function registerForProgram(
  _prev: ProgramRegisterState,
  formData: FormData,
): Promise<ProgramRegisterState> {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return { error: "We could not find that program. Please try again." };
  }

  const returnPath = `/programs/${slug}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(returnPath)}`);
  }

  const program = await getProgramBySlug(slug);
  if (!program) {
    return { error: "That program is not in the catalog." };
  }

  if (program.status !== "registration_open") {
    return { error: "Registration is not open for this program." };
  }

  if (!isRegistrationDeadlineOpen(program.registration_deadline)) {
    return { error: "Registration for this program has closed." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id")
    .eq("program_id", program.id)
    .eq("student_id", user.id)
    .maybeSingle();

  if (existingError) {
    console.error("Registration lookup failed:", existingError);
    return {
      error: "We could not complete your registration. Please try again.",
    };
  }

  if (existing) {
    return { error: ALREADY_REGISTERED_MESSAGE };
  }

  if (program.max_participants) {
    const { data: count, error: countError } = await supabase.rpc(
      "confirmed_registration_count",
      { p_program_id: program.id },
    );

    if (countError || count == null) {
      console.error("Registration count failed:", countError);
      return {
        error: "We could not complete your registration. Please try again.",
      };
    }

    if (Number(count) >= program.max_participants) {
      return { error: FULLY_BOOKED_MESSAGE };
    }
  }

  const { error } = await supabase.from("registrations").insert({
    program_id: program.id,
    student_id: user.id,
    status: "confirmed",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: ALREADY_REGISTERED_MESSAGE };
    }
    console.error("Registration insert failed:", error);
    return {
      error: "We could not complete your registration. Please try again.",
    };
  }

  revalidatePath(returnPath);
  revalidatePath("/dashboard");
  return {
    success: registrationSuccessMessage(program.title),
  };
}
