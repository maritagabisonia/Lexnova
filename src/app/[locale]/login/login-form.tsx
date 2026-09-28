"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";
import { Link } from "@/i18n/navigation";

const initialState: AuthActionState = {};

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />
      <AuthMessage state={state} />
      <Field id="email" label={t("email")} type="email" autoComplete="email" />
      <Field
        id="password"
        label={t("password")}
        type="password"
        autoComplete="current-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? t("signingIn") : t("logIn")}
      </button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/forgot-password" className="hover:text-accent">
          {t("forgotPassword")}
        </Link>
      </p>
      <p className="text-center text-sm text-ink-muted">
        {t("newHere")}{" "}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className="text-ink hover:text-accent"
        >
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
