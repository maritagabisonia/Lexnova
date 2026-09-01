"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";

const initialState: AuthActionState = {};

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <form action={action} className="space-y-5">
      <AuthMessage state={state} />
      <Field
        id="password"
        label="New password"
        type="password"
        autoComplete="new-password"
      />
      <Field
        id="confirmPassword"
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save new password"}
      </button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/login" className="hover:text-accent">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
