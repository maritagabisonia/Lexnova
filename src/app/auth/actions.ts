"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authErrorMessage, originFromHeaders } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

async function createProfileForUser(input: {
  id: string;
  fullName: string;
  email: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: input.id,
      full_name: input.fullName,
      email: input.email,
      role: "student",
    },
    { onConflict: "id" },
  );

  if (error) {
    const details = `${error.code ?? ""} ${error.message}`.toLowerCase();
    if (details.includes("duplicate") || error.code === "23505") {
      return;
    }
    throw error;
  }
}

export async function register(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!fullName) {
    return { error: "Please enter your full name." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 6) {
    return { error: "Please choose a stronger password (at least 6 characters)." };
  }

  const supabase = await createClient();
  const origin = originFromHeaders(await headers());

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback?next=/`,
    },
  });

  if (error) {
    return { error: authErrorMessage(error) };
  }

  if (data.user?.identities && data.user.identities.length === 0) {
    return { error: "That email is already registered." };
  }

  if (data.user && data.session) {
    try {
      await createProfileForUser({
        id: data.user.id,
        fullName,
        email: data.user.email ?? email,
      });
    } catch {
      return {
        error:
          "Your account was created, but we could not save your profile. Please contact us.",
      };
    }
  }

  if (!data.session) {
    return {
      success:
        "Account created. Please check your email to confirm your address, then log in.",
    };
  }

  redirect("/");
}

export async function login(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: authErrorMessage(error) };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const origin = originFromHeaders(await headers());

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: authErrorMessage(error) };
  }

  return {
    success:
      "If that email is registered, we sent a link to reset your password.",
  };
}

export async function updatePassword(
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "This reset link has expired. Please request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: authErrorMessage(error) };
  }

  redirect("/login");
}
