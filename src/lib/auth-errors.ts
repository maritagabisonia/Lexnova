import { getTranslations } from "next-intl/server";

export async function authErrorMessage(error: {
  message?: string;
  code?: string;
  status?: number;
} | null): Promise<string> {
  const t = await getTranslations("auth.errors");
  if (!error) {
    return t("generic");
  }

  const code = (error.code ?? "").toLowerCase();
  const message = (error.message ?? "").toLowerCase();
  const status = error.status ?? 0;

  if (
    code === "user_already_exists" ||
    message.includes("already registered") ||
    message.includes("already been registered") ||
    message.includes("user already registered")
  ) {
    return t("alreadyRegistered");
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return t("incorrectPassword");
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return t("emailNotConfirmed");
  }

  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("password is too short")
  ) {
    return t("weakPassword");
  }

  if (
    code === "over_email_send_rate_limit" ||
    status === 429 ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("too many attempts")
  ) {
    return t("rateLimited");
  }

  if (message.includes("invalid email") || code === "validation_failed") {
    return t("invalidEmail");
  }

  if (message.includes("same password") || code === "same_password") {
    return t("samePassword");
  }

  if (
    message.includes("expired") ||
    message.includes("invalid or missing") ||
    code === "otp_expired"
  ) {
    return t("expiredLink");
  }

  return t("generic");
}

export function originFromHeaders(headersList: Headers) {
  const origin = headersList.get("origin");
  if (origin) {
    return origin;
  }

  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
}
