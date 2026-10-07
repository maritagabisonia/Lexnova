"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import type { FaqFormValues } from "@/lib/faq-fields";
import {
  createFaqItem,
  updateFaqItem,
  type FaqActionState,
} from "./actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";
const textareaClass = `${inputClass} min-h-32`;

const initialState: FaqActionState = {};

export function FaqForm({
  mode,
  item,
}: {
  mode: "create" | "edit";
  item: FaqFormValues;
}) {
  const t = useTranslations("admin.form");
  const action = mode === "create" ? createFaqItem : updateFaqItem;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 max-w-5xl space-y-6">
      {item.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <AuthMessage state={state} />

      <p className="text-sm text-ink-muted">{t("copyLead")}</p>
      <div className="grid gap-6 lg:grid-cols-2">
        <Field
          id="question_ka"
          label={`${t("question")} · ${t("georgian")}`}
          defaultValue={item.question_ka}
          lang="ka"
        />
        <Field
          id="question"
          label={`${t("question")} · ${t("english")}`}
          defaultValue={item.question}
          lang="en"
        />
        <TextArea
          id="answer_ka"
          label={`${t("answer")} · ${t("georgian")}`}
          defaultValue={item.answer_ka}
          lang="ka"
        />
        <TextArea
          id="answer"
          label={`${t("answer")} · ${t("english")}`}
          defaultValue={item.answer}
          lang="en"
        />
      </div>

      {mode === "edit" ? (
        <dl className="grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
          <div>
            <dt>{t("id")}</dt>
            <dd className="mt-1 break-all text-ink">{item.id}</dd>
          </div>
          <div>
            <dt>{t("created")}</dt>
            <dd className="mt-1 text-ink">{item.created_at ?? "—"}</dd>
          </div>
          <div>
            <dt>{t("updated")}</dt>
            <dd className="mt-1 text-ink">{item.updated_at ?? "—"}</dd>
          </div>
        </dl>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending
          ? t("saving")
          : mode === "create"
            ? t("createFaq")
            : t("saveChanges")}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  lang,
}: {
  id: string;
  label: string;
  defaultValue: string;
  lang?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        lang={lang}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  id,
  label,
  defaultValue,
  lang,
}: {
  id: string;
  label: string;
  defaultValue: string;
  lang?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        lang={lang}
        defaultValue={defaultValue}
        className={textareaClass}
      />
    </div>
  );
}
