"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { register, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";
import { Link } from "@/i18n/navigation";

const initialState: AuthActionState = {};

export function RegisterForm({ next = "/dashboard" }: { next?: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <Field
        id="fullName"
        label={t("fullName")}
        autoComplete="name"
        missingMessage={t("errors.fullName")}
      />
      <Field
        id="email"
        label={t("email")}
        type="email"
        autoComplete="email"
        missingMessage={t("errors.invalidEmail")}
        typeMismatchMessage={t("errors.invalidEmail")}
      />
      <Field
        id="password"
        label={t("password")}
        type="password"
        autoComplete="new-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? t("creatingAccount") : t("createAccount")}
      </button>
      <p className="text-center text-sm text-ink-muted">
        {t("haveAccount")}{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="text-ink hover:text-accent"
        >
          {t("logIn")}
        </Link>
      </p>
    </form>
  );
}
