"use client";

import { useActionState, useState } from "react";
import { AuthMessage } from "@/components/auth-form";
import {
  programFormatOptions,
  programStatusOptions,
  type AdminLecturerOption,
  type ProgramFormValues,
} from "@/lib/program-fields";
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
        <legend className="mb-2 block text-sm text-ink">Type</legend>
        <div className="flex gap-2" role="group" aria-label="Program type">
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
                {value === "course" ? "Course" : "Training"}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Field
        id="title"
        label="Title"
        value={title}
        onChange={(value) => setTitle(value)}
      />
      <div className="space-y-1.5">
        <label htmlFor="slug" className="block text-sm text-ink">
          Slug
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
          Auto-generated from the title. You can edit it.
        </p>
      </div>

      <SelectField
        id="status"
        label="Status"
        defaultValue={program.status}
        options={programStatusOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
      <SelectField
        id="format"
        label="Format"
        defaultValue={program.format}
        options={programFormatOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
      />
      <SelectField
        id="lecturer_id"
        label="Lecturer"
        defaultValue={program.lecturer_id}
        required
        options={[
          { value: "", label: "Select a lecturer" },
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
        label="Short description"
        defaultValue={program.short_description}
      />
      <TextArea
        id="full_description"
        label="Full description"
        defaultValue={program.full_description}
      />
      <TextArea
        id="target_audience"
        label="Target audience"
        defaultValue={program.target_audience}
      />
      <TextArea
        id="objectives"
        label="Objectives"
        defaultValue={program.objectives}
      />
      <TextArea
        id="learning_outcomes"
        label="Learning outcomes"
        defaultValue={program.learning_outcomes}
      />

      <Field
        id="duration_text"
        label="Duration"
        defaultValue={program.duration_text}
        required={false}
      />
      <div className="grid gap-6 sm:grid-cols-3">
        <Field
          id="start_date"
          label="Start date"
          type="date"
          defaultValue={program.start_date}
          required={false}
        />
        <Field
          id="end_date"
          label="End date"
          type="date"
          defaultValue={program.end_date}
          required={false}
        />
        <Field
          id="registration_deadline"
          label="Registration deadline"
          type="date"
          defaultValue={program.registration_deadline}
          required={false}
        />
      </div>
      <Field
        id="location"
        label="Location"
        defaultValue={program.location}
        required={false}
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="max_participants"
          label="Max participants"
          type="number"
          defaultValue={program.max_participants}
          required={false}
          min={1}
        />
        <Field
          id="price"
          label="Price"
          type="number"
          defaultValue={program.price}
          required={false}
          min={0}
        />
      </div>

      {mode === "edit" ? (
        <dl className="grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
          <div>
            <dt>ID</dt>
            <dd className="mt-1 break-all text-ink">{program.id}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd className="mt-1 text-ink">{program.created_at ?? "—"}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd className="mt-1 text-ink">{program.updated_at ?? "—"}</dd>
          </div>
        </dl>
      ) : null}

      <button
        type="submit"
        disabled={pending || lecturers.length === 0}
        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink-muted disabled:opacity-60"
      >
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create program"
            : "Save changes"}
      </button>
      {lecturers.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Add a lecturer before you can save a program.
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
