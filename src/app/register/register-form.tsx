"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <form action={action} className="space-y-5">
      <AuthMessage state={state} />
      <Field id="fullName" label="Full name" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-ink-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-ink hover:text-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
