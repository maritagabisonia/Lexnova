"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";
import {
  updateAccountPassword,
  updateFullName,
} from "./actions";

const initialState: AuthActionState = {};

export function ProfileForms({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [nameState, nameAction, namePending] = useActionState(
    updateFullName,
    initialState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updateAccountPassword,
    initialState,
  );

  return (
    <div className="mt-8 space-y-10">
      <form action={nameAction} className="space-y-5">
        <h2 className="text-xl">Your details</h2>
        <AuthMessage state={nameState} />
        <div className="space-y-1.5">
          <p className="text-sm text-ink">Email</p>
          <p className="text-sm text-ink-muted">{email || "Not set"}</p>
        </div>
        <Field
          id="fullName"
          label="Full name"
          autoComplete="name"
          defaultValue={fullName}
        />
        <button
          type="submit"
          disabled={namePending}
          className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
        >
          {namePending ? "Saving…" : "Save name"}
        </button>
      </form>

      <form action={passwordAction} className="space-y-5">
        <h2 className="text-xl">Password</h2>
        <AuthMessage state={passwordState} />
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
          disabled={passwordPending}
          className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
        >
          {passwordPending ? "Saving…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
