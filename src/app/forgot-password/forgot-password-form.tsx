"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  requestPasswordReset,
  type AuthActionState,
} from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";

const initialState: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <form action={action} className="space-y-5">
      <AuthMessage state={state} />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/login" className="hover:text-accent">
          Back to log in
        </Link>
      </p>
    </form>
  );
}
