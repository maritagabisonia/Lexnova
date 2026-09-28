"use client";

import { useTranslations } from "next-intl";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";
const textareaClass = `${inputClass} min-h-32`;

export function TranslationPair({
  name,
  label,
  englishValue,
  onEnglishChange,
  englishDefault = "",
  georgianDefault = "",
  multiline = false,
  tall = false,
}: {
  name: string;
  label: string;
  englishValue?: string;
  onEnglishChange?: (value: string) => void;
  englishDefault?: string;
  georgianDefault?: string;
  multiline?: boolean;
  tall?: boolean;
}) {
  const t = useTranslations("admin.form");
  const areaClass = tall ? `${textareaClass} min-h-56` : textareaClass;

  return (
    <fieldset>
      <legend className="mb-2 block text-sm text-ink">{label}</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <LanguageField
          id={name}
          language={t("english")}
          multiline={multiline}
          className={multiline ? areaClass : inputClass}
          value={englishValue}
          defaultValue={onEnglishChange ? undefined : englishDefault}
          onChange={onEnglishChange}
        />
        <LanguageField
          id={`${name}_ka`}
          language={t("georgian")}
          multiline={multiline}
          className={multiline ? areaClass : inputClass}
          defaultValue={georgianDefault}
        />
      </div>
    </fieldset>
  );
}

function LanguageField({
  id,
  language,
  multiline,
  className,
  value,
  defaultValue,
  onChange,
}: {
  id: string;
  language: string;
  multiline: boolean;
  className: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const shared = {
    id,
    name: id,
    className,
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs tracking-wide text-ink-muted">
        {language}
      </label>
      {multiline ? (
        <textarea {...shared} defaultValue={defaultValue} />
      ) : (
        <input
          {...shared}
          type="text"
          value={onChange ? (value ?? "") : undefined}
          defaultValue={onChange ? undefined : defaultValue}
          onChange={
            onChange ? (event) => onChange(event.target.value) : undefined
          }
        />
      )}
    </div>
  );
}
