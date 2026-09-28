"use server";

import { getTranslations } from "next-intl/server";
import type { AuthActionState } from "@/app/auth/actions";
import { authErrorMessage } from "@/lib/auth-errors";
import { FIELD_MAX, tooLong } from "@/lib/form-input";
import { revalidateLocalized } from "@/lib/revalidate";
import { requireUser } from "@/lib/require-auth";

export async function updateFullName(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("dashboard");
  const authT = await getTranslations("auth.errors");
  const fields = await getTranslations("errors.fields");
  const tooLongT = await getTranslations("errors");
  const fullName = String(formData.get("fullName") ?? "").trim();

  if (!fullName) {
    return { error: authT("fullName") };
  }
  if (tooLong(fullName, FIELD_MAX.name, "Name")) {
    return { error: tooLongT("tooLong", { field: fields("name") }) };
  }

  const { supabase, user } = await requireUser();
  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return { error: t("nameSaveFailed") };
  }

  await supabase.auth.updateUser({
    data: { full_name: fullName },
  });

  revalidateLocalized("/dashboard", "layout");
  return { success: t("nameSaved") };
}

export async function updateAccountPassword(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("dashboard");
  const authT = await getTranslations("auth.errors");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: authT("weakPassword") };
  }
  if (password.length > FIELD_MAX.password) {
    return { error: authT("shortPassword") };
  }
  if (password !== confirm) {
    return { error: authT("mismatch") };
  }

  const { supabase } = await requireUser();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  return { success: t("passwordUpdated") };
}
