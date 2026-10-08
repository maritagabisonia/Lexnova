"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import type { LecturerFormValues } from "@/lib/lecturer-fields";
import {
  createLecturer,
  updateLecturer,
  type LecturerActionState,
} from "./actions";
import { LecturerPhotoField } from "./lecturer-photo-field";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";
const textareaClass = `${inputClass} min-h-32`;

const initialState: LecturerActionState = {};

export function LecturerForm({
  mode,
  lecturer,
}: {
  mode: "create" | "edit";
  lecturer: LecturerFormValues;
}) {
  const t = useTranslations("admin.form");
  const action = mode === "create" ? createLecturer : updateLecturer;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showOnAbout, setShowOnAbout] = useState(lecturer.show_on_about);

  return (
    <form action={formAction} className="mt-8 max-w-3xl space-y-6">
      {lecturer.id ? <input type="hidden" name="id" value={lecturer.id} /> : null}
      <input
        type="hidden"
        name="show_on_about"
        value={showOnAbout ? "true" : "false"}
      />
      <AuthMessage state={state} />

      <Field id="full_name" label={t("fullName")} defaultValue={lecturer.full_name} />
      <Field
        id="title"
        label={t("title")}
        defaultValue={lecturer.title}
        required={false}
      />
      <LecturerPhotoField
        lecturerId={lecturer.id}
        initialUrl={lecturer.photo_url}
        onUploadingChange={setPhotoUploading}
      />
      <div className="space-y-1.5">
        <label htmlFor="bio" className="block text-sm text-ink">
          {t("bio")}
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={lecturer.bio}
          className={textareaClass}
        />
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm text-ink">{t("showOnAbout")}</legend>
        <div className="flex gap-2" role="group" aria-label={t("showOnAbout")}>
          {(
            [
              { value: true, label: t("showOnAboutShow") },
              { value: false, label: t("showOnAboutHide") },
            ] as const
          ).map((option) => {
            const selected = showOnAbout === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={selected}
                onClick={() => setShowOnAbout(option.value)}
                className={`min-h-11 rounded-sm px-4 text-sm ${
                  selected
                    ? "bg-ink text-paper"
                    : "border border-ink/15 text-ink hover:border-accent"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {mode === "edit" ? (
        <dl className="grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
          <div>
            <dt>{t("id")}</dt>
            <dd className="mt-1 break-all text-ink">{lecturer.id}</dd>
          </div>
          <div>
            <dt>{t("created")}</dt>
            <dd className="mt-1 text-ink">{lecturer.created_at ?? "—"}</dd>
          </div>
        </dl>
      ) : null}

      <button
        type="submit"
        disabled={pending || photoUploading}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending
          ? t("saving")
          : mode === "create"
            ? t("createLecturer")
            : t("saveChanges")}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  required = true,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
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
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </div>
  );
}
