"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updatePassword, type AuthActionState } from "@/app/auth/actions";
import { AuthMessage, Field } from "@/components/auth-form";
import { Link } from "@/i18n/navigation";

const initialState: AuthActionState = {};

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(
    updatePassword,
    initialState,
  );

  return (
    <form action={action} className="space-y-5">
      <AuthMessage state={state} />
      <Field
        id="password"
        label={t("newPassword")}
        type="password"
        autoComplete="new-password"
      />
      <Field
        id="confirmPassword"
        label={t("confirmPassword")}
        type="password"
        autoComplete="new-password"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending ? t("saving") : t("savePassword")}
      </button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/login" className="hover:text-accent">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
