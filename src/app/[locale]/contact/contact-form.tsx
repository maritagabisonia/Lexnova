"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage, Field, validityProps } from "@/components/auth-form";
import {
  sendContactMessage,
  type ContactActionState,
} from "./actions";

const initialState: ContactActionState = {};

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, action, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  if (state.success) {
    return (
      <p
        role="status"
        className="border-l-4 border-ink bg-paper-muted px-3 py-3 text-base text-ink"
      >
        {state.success}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <AuthMessage state={state} />
      <Field
        id="name"
        label={t("name")}
        autoComplete="name"
        missingMessage={t("errors.name")}
      />
      <Field
        id="email"
        label={t("email")}
        type="email"
        autoComplete="email"
        missingMessage={t("errors.email")}
        typeMismatchMessage={t("errors.email")}
      />
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm text-ink">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="min-h-32 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
          {...validityProps({
            missing: t("errors.message"),
            typeMismatch: t("errors.message"),
          })}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? t("sending") : t("send")}
      </button>
    </form>
  );
}
