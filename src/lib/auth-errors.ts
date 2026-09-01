export function authErrorMessage(error: {
  message?: string;
  code?: string;
  status?: number;
} | null): string {
  if (!error) {
    return "Something went wrong. Please try again.";
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
    return "That email is already registered.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials")
  ) {
    return "Incorrect password.";
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }

  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("password is too short")
  ) {
    return "Please choose a stronger password (at least 6 characters).";
  }

  if (
    code === "over_email_send_rate_limit" ||
    status === 429 ||
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("too many attempts")
  ) {
    return "Too many attempts. Please wait a minute and try again.";
  }

  if (message.includes("invalid email") || code === "validation_failed") {
    return "Please enter a valid email address.";
  }

  if (message.includes("same password") || code === "same_password") {
    return "Please choose a password you have not used before.";
  }

  if (
    message.includes("expired") ||
    message.includes("invalid or missing") ||
    code === "otp_expired"
  ) {
    return "This reset link has expired. Please request a new one.";
  }

  return "Something went wrong. Please try again.";
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
