"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";

const initialState: AuthActionState = {};

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/forgot-password" className="hover:text-accent">
          Forgot your password?
        </Link>
      </p>
      <p className="text-center text-sm text-ink-muted">
        New to LexNova?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className="text-ink hover:text-accent"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
