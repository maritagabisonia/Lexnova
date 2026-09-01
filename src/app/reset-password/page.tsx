import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Reset password</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Choose a new password for your LexNova account.
      </p>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </section>
  );
}
