"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/redirect";
import { authErrorMessage, originFromHeaders } from "@/lib/auth-errors";
import { safeNextPath } from "@/lib/auth-paths";
import { FIELD_MAX, tooLong } from "@/lib/form-input";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function register(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("auth.errors");
  const fields = await getTranslations("errors.fields");
  const tooLongT = await getTranslations("errors");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName) {
    return { error: t("fullName") };
  }
  if (tooLong(fullName, FIELD_MAX.name, "Name")) {
    return { error: tooLongT("tooLong", { field: fields("name") }) };
  }
  if (!email || !email.includes("@")) {
    return { error: t("invalidEmail") };
  }
  if (tooLong(email, FIELD_MAX.email, "Email")) {
    return { error: tooLongT("tooLong", { field: fields("email") }) };
  }
  if (password.length < 6) {
    return { error: t("weakPassword") };
  }
  if (password.length > FIELD_MAX.password) {
    return { error: t("shortPassword") };
  }

  const supabase = await createClient();
  const origin = originFromHeaders(await headers());
  const next = safeNextPath(String(formData.get("next") ?? ""), "/dashboard");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    return { error: t("alreadyRegistered") };
  }

  if (!data.session) {
    const successT = await getTranslations("auth.success");
    return { success: successT("confirmEmail") };
  }

  return redirect(next);
}

export async function login(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("auth.errors");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: t("emailPassword") };
  }
  if (tooLong(email, FIELD_MAX.email, "Email")) {
    return { error: t("invalidEmail") };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  return redirect(safeNextPath(String(formData.get("next") ?? ""), "/dashboard"));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("auth.errors");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@") || tooLong(email, FIELD_MAX.email, "Email")) {
    return { error: t("invalidEmail") };
  }

  const supabase = await createClient();
  const origin = originFromHeaders(await headers());

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  const successT = await getTranslations("auth.success");
  return { success: successT("resetSent") };
}

export async function updatePassword(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const t = await getTranslations("auth.errors");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: t("weakPassword") };
  }
  if (password.length > FIELD_MAX.password) {
    return { error: t("shortPassword") };
  }
  if (password !== confirm) {
    return { error: t("mismatch") };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: t("expiredLink") };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: await authErrorMessage(error) };
  }

  return redirect("/login");
}
