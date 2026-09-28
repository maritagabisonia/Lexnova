"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import type { AuthActionState } from "@/app/auth/actions";

function applyValidityMessage(
  event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  messages: { missing: string; typeMismatch: string },
) {
  const el = event.currentTarget;
  if (el.validity.valueMissing) {
    el.setCustomValidity(messages.missing);
    return;
  }
  if (el.validity.typeMismatch) {
    el.setCustomValidity(messages.typeMismatch);
    return;
  }
  el.setCustomValidity("");
}

export function AuthMessage({ state }: { state: AuthActionState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {state.error}
      </p>
    );
  }

  if (state.success) {
    return (
      <p
        role="status"
        className="border-l-4 border-ink bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {state.success}
      </p>
    );
  }

  return null;
}

export function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  defaultValue,
  missingMessage,
  typeMismatchMessage,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  missingMessage?: string;
  typeMismatchMessage?: string;
}) {
  const t = useTranslations("errors");
  const messages = {
    missing: missingMessage ?? t("required"),
    typeMismatch: typeMismatchMessage ?? t("invalidEmail"),
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        onInvalid={(event) => applyValidityMessage(event, messages)}
        onInput={(event) => event.currentTarget.setCustomValidity("")}
        className="min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
      />
    </div>
  );
}

export function validityProps(messages: {
  missing: string;
  typeMismatch: string;
}) {
  return {
    onInvalid: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      applyValidityMessage(event, messages),
    onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      event.currentTarget.setCustomValidity(""),
  };
}
