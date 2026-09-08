"use client";

import { useActionState } from "react";
import { AuthMessage, Field } from "@/components/auth-form";
import {
  sendContactMessage,
  type ContactActionState,
} from "@/app/contact/actions";

const initialState: ContactActionState = {};

export function ContactForm() {
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
      <Field id="name" label="Name" autoComplete="name" />
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-ink px-5 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
