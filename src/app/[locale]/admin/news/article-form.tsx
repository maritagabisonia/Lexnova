"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import {
  type NewsFormValues,
  type RelatedProgramOption,
} from "@/lib/news-fields";
import { slugify } from "@/lib/slug";
import {
  createArticle,
  updateArticle,
  type NewsActionState,
} from "./actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";
const textareaClass = `${inputClass} min-h-32`;

const initialState: NewsActionState = {};

export function ArticleForm({
  mode,
  article,
  programs,
}: {
  mode: "create" | "edit";
  article: NewsFormValues;
  programs: RelatedProgramOption[];
}) {
  const t = useTranslations("admin.form");
  const action = mode === "create" ? createArticle : updateArticle;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [title, setTitle] = useState(article.title);
  const [slug, setSlug] = useState(article.slug);
  const [slugLocked, setSlugLocked] = useState(mode === "edit");
  const [published, setPublished] = useState(article.published);
  const [coverUrl, setCoverUrl] = useState(article.cover_image_url);
  const displayedSlug = slugLocked ? slug : slugify(title);

  return (
    <form action={formAction} className="mt-8 max-w-3xl space-y-6">
      {article.id ? <input type="hidden" name="id" value={article.id} /> : null}
      <input type="hidden" name="published" value={published ? "true" : "false"} />
      <AuthMessage state={state} />

      <fieldset>
        <legend className="mb-2 block text-sm text-ink">{t("visibility")}</legend>
        <div className="flex gap-2" role="group" aria-label={t("publishState")}>
          {(
            [
              { value: true, label: t("publish") },
              { value: false, label: t("unpublish") },
            ] as const
          ).map((option) => {
            const selected = published === option.value;
            return (
              <button
                key={String(option.value)}
                type="button"
                aria-pressed={selected}
                onClick={() => setPublished(option.value)}
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

      <Field id="title" label={t("title")} value={title} onChange={setTitle} />
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

      <Field
        id="author"
        label={t("author")}
        defaultValue={article.author}
        required={false}
      />
      <div className="space-y-1.5">
        <label htmlFor="related_program_id" className="block text-sm text-ink">
          {t("relatedProgram")}
        </label>
        <select
          id="related_program_id"
          name="related_program_id"
          defaultValue={article.related_program_id}
          className={inputClass}
        >
          <option value="">{t("none")}</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.title}
            </option>
          ))}
        </select>
      </div>

      <Field
        id="cover_image_url"
        label={t("coverImageUrl")}
        value={coverUrl}
        onChange={setCoverUrl}
        required={false}
      />
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt="" className="aspect-[16/9] w-full max-w-md object-cover" />
      ) : null}

      <TextArea
        id="short_description"
        label={t("shortDescription")}
        defaultValue={article.short_description}
      />
      <TextArea
        id="content"
        label={t("content")}
        defaultValue={article.content}
        tall
      />
      <Field
        id="published_at"
        label={t("publishedAt")}
        type="datetime-local"
        defaultValue={article.published_at}
        required={false}
      />

      {mode === "edit" ? (
        <dl className="grid gap-3 text-sm text-ink-muted sm:grid-cols-2">
          <div>
            <dt>{t("id")}</dt>
            <dd className="mt-1 break-all text-ink">{article.id}</dd>
          </div>
          <div>
            <dt>{t("created")}</dt>
            <dd className="mt-1 text-ink">{article.created_at ?? "—"}</dd>
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
            ? t("createArticle")
            : t("saveChanges")}
      </button>
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
}: {
  id: string;
  label: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
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
        type={type}
        required={required}
        value={value}
        defaultValue={onChange ? undefined : defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  id,
  label,
  defaultValue,
  tall = false,
}: {
  id: string;
  label: string;
  defaultValue: string;
  tall?: boolean;
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
        className={tall ? `${textareaClass} min-h-56` : textareaClass}
      />
    </div>
  );
}
