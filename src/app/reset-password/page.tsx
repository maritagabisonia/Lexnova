import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Reset password</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Choose a new password for your LexNova account.
      </p>
      <div className="mt-8">
        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="space-y-5">
            <p
              role="alert"
              className="border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
            >
              This reset link has expired. Please request a new one.
            </p>
            <p className="text-center text-sm text-ink-muted">
              <Link href="/forgot-password" className="hover:text-accent">
                Request a new reset link
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
