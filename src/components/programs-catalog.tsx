"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProgramCard } from "@/components/program-card";
import {
  programFormatFilters,
  programMatchesQuery,
  programStatusFilters,
  programTypeFilters,
  translatedFormatLabel,
  translatedStatusLabel,
  translatedTypeLabel,
  type ProgramSummary,
} from "@/lib/program-display";

const selectClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm text-ink";

export function ProgramsCatalog({
  programs,
  initialType,
}: {
  programs: ProgramSummary[];
  initialType?: string;
}) {
  const t = useTranslations("programs");
  const [query, setQuery] = useState("");
  const [type, setType] = useState(
    initialType === "course" || initialType === "training" ? initialType : "",
  );
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim();
    return programs.filter((program) => {
      if (type && program.type !== type) {
        return false;
      }
      if (
        format &&
        program.status !== "coming_soon" &&
        program.format !== format
      ) {
        return false;
      }
      if (status && program.status !== status) {
        return false;
      }
      if (needle && !programMatchesQuery(program, needle)) {
        return false;
      }
      return true;
    });
  }, [programs, query, type, format, status]);

  const filtersActive = Boolean(query.trim() || type || format || status);

  function clearFilters() {
    setQuery("");
    setType("");
    setFormat("");
    setStatus("");
  }

  return (
    <div className="mt-10">
      <form
        className="grid gap-4 border border-ink/10 bg-paper p-4 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          {t("searchTitle")}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className={selectClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          {t("type")}
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={selectClass}
          >
            <option value="">{t("allTypes")}</option>
            {programTypeFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {translatedTypeLabel(option.value, t)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          {t("format")}
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className={selectClass}
          >
            <option value="">{t("allFormats")}</option>
            {programFormatFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {translatedFormatLabel(option.value, t)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          {t("status")}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={selectClass}
          >
            <option value="">{t("allStatuses")}</option>
            {programStatusFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {translatedStatusLabel(option.value, t)}
              </option>
            ))}
          </select>
        </label>
      </form>

      {programs.length > 0 || filtersActive ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
          {programs.length > 0 ? (
            <p>
              {t("showing", {
                filtered: filtered.length,
                total: programs.length,
              })}
            </p>
          ) : (
            <p />
          )}
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center text-ink hover:text-accent"
            >
              {t("clearFilters")}
            </button>
          ) : null}
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-muted">
          {programs.length === 0 ? t("empty") : t("noMatch")}
        </p>
      )}
    </div>
  );
}
