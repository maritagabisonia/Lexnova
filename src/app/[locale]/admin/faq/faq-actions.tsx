"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import {
  deleteFaqItem,
  moveFaqItem,
  type FaqActionState,
} from "./actions";

const initialState: FaqActionState = {};

export function MoveFaqButton({
  id,
  direction,
  disabled,
}: {
  id: string;
  direction: "up" | "down";
  disabled?: boolean;
}) {
  const t = useTranslations("admin.form");
  const [state, action, pending] = useActionState(moveFaqItem, initialState);
  const label = direction === "up" ? t("moveUp") : t("moveDown");

  return (
    <form action={action} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      {state.error ? (
        <span role="alert" className="sr-only">
          {state.error}
        </span>
      ) : null}
      <button
        type="submit"
        disabled={disabled || pending}
        aria-label={label}
        className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-ink hover:text-accent disabled:opacity-40"
      >
        {direction === "up" ? "↑" : "↓"}
      </button>
    </form>
  );
}

export function DeleteFaqButton({
  id,
  question,
}: {
  id: string;
  question: string;
}) {
  const t = useTranslations("admin.form");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteFaqItem, initialState);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  return (
    <>
      <button
        type="button"
        className="text-sm text-ink hover:text-accent"
        onClick={() => setOpen(true)}
      >
        {t("delete")}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={() => {
            if (!pending) {
              setOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-faq-title"
            className="w-full max-w-md border border-ink/10 bg-paper p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-faq-title" className="text-xl">
              {t("deleteFaqTitle")}
            </h3>
            <p className="mt-3 text-sm text-ink-muted">
              {t("deleteFaqBody", { question })}
            </p>
            <AuthMessage state={state} />
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/15 px-4 text-sm text-ink hover:border-accent"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                {t("cancel")}
              </button>
              <form action={action}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper hover:bg-ink-muted disabled:opacity-60"
                >
                  {pending ? t("deleting") : t("delete")}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
