"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import {
  programFormatOptions,
  programStatusOptions,
  type AdminLecturerOption,
  type ProgramFormValues,
} from "@/lib/program-fields";
import {
  translatedFormatLabel,
  translatedStatusLabel,
  translatedTypeLabel,
} from "@/lib/program-display";
import { slugify } from "@/lib/slug";
import {
  createProgram,
  updateProgram,
  type ProgramActionState,
} from "./actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";
const textareaClass = `${inputClass} min-h-32`;

const initialState: ProgramActionState = {};

export function ProgramForm({
  mode,
  lecturers,
  program,
}: {
  mode: "create" | "edit";
  lecturers: AdminLecturerOption[];
  program: ProgramFormValues;
}) {
  const t = useTranslations("admin.form");
  const programsT = useTranslations("programs");
  const action = mode === "create" ? createProgram : updateProgram;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [type, setType] = useState(program.type);
  const [title, setTitle] = useState(program.title);
  const [slug, setSlug] = useState(program.slug);
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const displayedSlug = slugLocked ? slug : slugify(title);

  return (
    <form action={formAction} className="mt-8 max-w-3xl space-y-6">
      {program.id ? <input type="hidden" name="id" value={program.id} /> : null}
      <input type="hidden" name="type" value={type} />
      <AuthMessage state={state} />

      <fieldset>
        <legend className="mb-2 block text-sm text-ink">{t("type")}</legend>
        <div className="flex gap-2" role="group" aria-label={t("typeAria")}>
          {(["course", "training"] as const).map((value) => {
            const selected = type === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setType(value)}
                className={`min-h-11 rounded-sm px-4 text-sm ${
                  selected
                    ? "bg-ink text-paper"
                    : "border border-ink/15 text-ink hover:border-accent"
                }`}
              >
                {translatedTypeLabel(value, programsT)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field
        id="title"
        label={t("title")}
        value={title}
        onChange={(value) => setTitle(value)}
      />
      <div className="space-y-1.5">
        <label htmlFor="slug" className="block text-sm text-ink">
          {t("slug")}
        </label>
        <input
          id="slug"
          name="slug"
          value={displayedSlug}
          onChange={(event) => {
            setSlugLocked(true);
            setSlug(event.target.value);
          }}
          className={inputClass}
          autoComplete="off"
        />
        <p className="text-xs text-ink-muted">
          {t("slugHint")}
        </p>
      </div>

      <SelectField
        id="status"
        label={t("status")}
        defaultValue={program.status}
        options={programStatusOptions.map((option) => ({
          value: option.value,
          label: translatedStatusLabel(option.value, programsT),
        }))}
      />
      <SelectField
        id="format"
        label={t("format")}
        defaultValue={program.format}
        options={programFormatOptions.map((option) => ({
          value: option.value,
          label: translatedFormatLabel(option.value, programsT),
        }))}
      />
      <SelectField
        id="lecturer_id"
        label={t("lecturer")}
        defaultValue={program.lecturer_id}
        required={false}
        options={[
          { value: "", label: t("selectLecturer") },
          ...lecturers.map((lecturer) => ({
            value: lecturer.id,
            label: lecturer.title
              ? `${lecturer.fullName} — ${lecturer.title}`
              : lecturer.fullName,
          })),
        ]}
      />

      <TextArea
        id="short_description"
        label={t("shortDescription")}
        defaultValue={program.short_description}
      />
      <TextArea
        id="full_description"
        label={t("fullDescription")}
        defaultValue={program.full_description}
      />
      <TextArea
        id="target_audience"
        label={t("targetAudience")}
        defaultValue={program.target_audience}
      />
      <TextArea
        id="objectives"
        label={t("objectives")}
        defaultValue={program.objectives}
      />
      <TextArea
        id="learning_outcomes"
        label={t("learningOutcomes")}
        defaultValue={program.learning_outcomes}
      />

      <Field
        id="duration_text"
        label={t("duration")}
        defaultValue={program.duration_text}
        required={false}
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          id="start_date"
          label={t("startDate")}
          type="date"
          defaultValue={program.start_date}
          required={false}
        />
        <Field
          id="end_date"
          label={t("endDate")}
          type="date"
          defaultValue={program.end_date}
          required={false}
        />
        <Field
          id="registration_deadline"
          label={t("registrationDeadline")}
          type="date"
          defaultValue={program.registration_deadline}
          required={false}
        />
      </div>
      <Field
        id="location"
        label={t("location")}
        defaultValue={program.location}
        required={false}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="max_participants"
          label={t("maxParticipants")}
          type="number"
          defaultValue={program.max_participants}
          required={false}
          min={1}
        />
        <Field
          id="price"
          label={t("price")}
          type="number"
          defaultValue={program.price}
          required={false}
          min={0}
        />
      </div>

      {mode === "edit" ? (
        <dl className="grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
          <div>
            <dt>{t("id")}</dt>
            <dd className="mt-1 break-all text-ink">{program.id}</dd>
          </div>
          <div>
            <dt>{t("created")}</dt>
            <dd className="mt-1 text-ink">{program.created_at ?? "—"}</dd>
          </div>
          <div>
            <dt>{t("updated")}</dt>
            <dd className="mt-1 text-ink">{program.updated_at ?? "—"}</dd>
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
            ? t("createProgram")
            : t("saveChanges")}
      </button>
      {lecturers.length === 0 ? (
        <p className="text-sm text-ink-muted">
          {t("needLecturer")}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  defaultValue,
  onChange,
  required = true,
  min,
}: {
  id: string;
  label: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  min?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        defaultValue={onChange ? undefined : defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        min={min}
        step={id === "price" ? "0.01" : type === "number" ? "1" : undefined}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  id,
  label,
  defaultValue,
}: {
  id: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        defaultValue={defaultValue}
        className={textareaClass}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  defaultValue,
  options,
  required = true,
}: {
  id: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-ink">
        {label}
      </label>
      <select
        id={id}
        name={id}
        required={required}
        defaultValue={defaultValue}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
