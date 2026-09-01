import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Forgot password</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Enter the email for your LexNova account and we will send a reset link.
      </p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
