"use client";

import { useActionState } from "react";
import { AuthMessage } from "@/components/auth-form";
import {
  ALREADY_REGISTERED_MESSAGE,
  FULLY_BOOKED_MESSAGE,
} from "@/lib/program-register";
import {
  registerForProgram,
  type ProgramRegisterState,
} from "./actions";

const initialState: ProgramRegisterState = {};

const disabledButtonClass =
  "inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-sm border border-ink/20 bg-paper-muted px-6 text-sm text-ink-muted";

export function ProgramRegisterForm({
  slug,
  alreadyRegistered = false,
}: {
  slug: string;
  alreadyRegistered?: boolean;
}) {
  const [state, action, pending] = useActionState(
    registerForProgram,
    initialState,
  );

  if (state.success) {
    return <AuthMessage state={state} />;
  }

  if (alreadyRegistered || state.error === ALREADY_REGISTERED_MESSAGE) {
    return (
      <p
        role="status"
        className="border-l-4 border-ink bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {ALREADY_REGISTERED_MESSAGE}
      </p>
    );
  }

  if (state.error === FULLY_BOOKED_MESSAGE) {
    return (
      <button type="button" disabled className={disabledButtonClass}>
        {FULLY_BOOKED_MESSAGE}
      </button>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <AuthMessage state={state} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Registering…" : "Register"}
      </button>
    </form>
  );
}
