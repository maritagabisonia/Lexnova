"use client";

import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/program-card";
import {
  programFormatFilters,
  programStatusFilters,
  programTypeFilters,
  type ProgramSummary,
} from "@/lib/catalog";

const selectClass =
  "w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-sm text-ink";

export function ProgramsCatalog({
  programs,
  initialType,
}: {
  programs: ProgramSummary[];
  initialType?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(
    initialType === "course" || initialType === "training" ? initialType : "",
  );
  const [format, setFormat] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return programs.filter((program) => {
      if (type && program.type !== type) {
        return false;
      }
      if (format && program.format !== format) {
        return false;
      }
      if (status && program.status !== status) {
        return false;
      }
      if (needle && !program.title.toLowerCase().includes(needle)) {
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
          Search title
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title"
            className={selectClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          Type
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className={selectClass}
          >
            <option value="">All types</option>
            {programTypeFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          Format
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value)}
            className={selectClass}
          >
            <option value="">All formats</option>
            {programFormatFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs tracking-wide text-ink-muted">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={selectClass}
          >
            <option value="">All statuses</option>
            {programStatusFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      {programs.length > 0 ? (
      {programs.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink-muted">
          <p>
            Showing {filtered.length} of {programs.length} programs
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-ink hover:text-accent"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : null}
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-ink-muted">
          {programs.length === 0
            ? "No programs are listed yet."
            : "No programs match these filters."}
        </p>
      )}
    </div>
  );
}
