"use server";

import { revalidatePath } from "next/cache";
import type { AuthActionState } from "@/app/auth/actions";
import { authErrorMessage } from "@/lib/auth-errors";
import { requireUser } from "@/lib/require-auth";

export async function updateFullName(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!fullName) {
    return { error: "Please enter your full name." };
  }

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      error: "We could not save your name. Please try again.",
    };
  }

  await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  revalidatePath("/dashboard/profile");
  return { success: "Your name has been saved." };
}

export async function updateAccountPassword(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: "Please choose a stronger password (at least 6 characters)." };
  }
  if (password !== confirm) {
    return { error: "Those passwords do not match." };
  }

  const { supabase } = await requireUser();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: authErrorMessage(error) };
  }

  return { success: "Your password has been updated." };
}
