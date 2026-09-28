"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
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
  const t = useTranslations("programs");
  const [state, action, pending] = useActionState(
    registerForProgram,
    initialState,
  );

  if (state.success) {
    return <AuthMessage state={state} />;
  }

  if (alreadyRegistered || state.code === "alreadyRegistered") {
    return (
      <p
        role="status"
        className="border-l-4 border-ink bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {t("alreadyRegistered")}
      </p>
    );
  }

  if (state.code === "fullyBooked") {
    return (
      <button type="button" disabled className={disabledButtonClass}>
        {t("fullyBooked")}
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
        {pending ? t("registering") : t("register")}
      </button>
    </form>
  );
}
