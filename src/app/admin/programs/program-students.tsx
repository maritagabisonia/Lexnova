"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { AuthMessage } from "@/components/auth-form";
import type {
  AdminRegistrationRow,
  StudentSearchResult,
} from "@/lib/admin-registrations";
import {
  addStudentRegistration,
  removeStudentRegistration,
  searchStudentsForProgram,
  type RegistrationActionState,
} from "./registration-actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";

const initialState: RegistrationActionState = {};

export function ProgramStudents({
  programId,
  programSlug,
  registrations,
  notice,
}: {
  programId: string;
  programSlug: string;
  registrations: AdminRegistrationRow[];
  notice?: string;
}) {
  const [pendingRemove, setPendingRemove] = useState<AdminRegistrationRow | null>(
    null,
  );

  return (
    <div className="mt-8 max-w-3xl">
      {notice ? (
        <p
          role="status"
          className="mb-6 border-l-4 border-ink bg-paper-muted px-3 py-2 text-sm text-ink"
        >
          {notice}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl">Registered students</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Confirmed registrations only. Remove cancels the row; it does not
            delete it.
          </p>
        </div>
      </div>

      <AddStudentSearch programId={programId} programSlug={programSlug} />

      {registrations.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">No students registered.</p>
      ) : (
        <>
          <ul className="mt-6 space-y-3 sm:hidden">
            {registrations.map((row) => (
              <li
                key={row.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">{row.name}</p>
                <p className="mt-1 text-ink-muted">{row.email}</p>
                <p className="mt-1 text-ink-muted">{row.registeredAt}</p>
                <button
                  type="button"
                  onClick={() => setPendingRemove(row)}
                  className="mt-3 text-sm text-ink hover:text-accent"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Registered</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((row) => (
                  <tr key={row.id} className="border-b border-ink/10">
                    <td className="py-3 pr-4 text-ink">{row.name}</td>
                    <td className="py-3 pr-4 text-ink-muted">{row.email}</td>
                    <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                      {row.registeredAt}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <button
                        type="button"
                        onClick={() => setPendingRemove(row)}
                        className="text-sm text-ink hover:text-accent"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {pendingRemove ? (
        <RemoveStudentDialog
          programId={programId}
          programSlug={programSlug}
          row={pendingRemove}
          onClose={() => setPendingRemove(null)}
        />
      ) : null}
    </div>
  );
}

function AddStudentSearch({
  programId,
  programSlug,
}: {
  programId: string;
  programSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentSearchResult[]>([]);
  const [searching, startSearch] = useTransition();
  const [state, addAction, pending] = useActionState(
    addStudentRegistration,
    initialState,
  );

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setResults([]);
        return;
      }
      startSearch(async () => {
        const next = await searchStudentsForProgram(programId, trimmed);
        setResults(next);
      });
    }, 250);
    return () => window.clearTimeout(handle);
  }, [programId, query]);

  return (
    <div className="mt-8 border border-ink/10 bg-paper p-4">
      <h3 className="text-lg">Add Student</h3>
      <p className="mt-1 text-sm text-ink-muted">
        Search by name or email, then select a student.
      </p>
      <AuthMessage state={state} />
      <label htmlFor="student-search" className="mt-4 block text-sm text-ink">
        Search students
      </label>
      <input
        id="student-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Name or email"
        autoComplete="off"
        className={`mt-1.5 ${inputClass}`}
      />
      {searching ? (
        <p className="mt-3 text-sm text-ink-muted">Searching…</p>
      ) : query.trim().length >= 2 && results.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">No matching students.</p>
      ) : results.length > 0 ? (
        <ul className="mt-3 divide-y divide-ink/10 border border-ink/10" role="listbox">
          {results.map((student) => (
            <li key={student.id}>
              <form action={addAction} className="flex items-center justify-between gap-3 p-3">
                <input type="hidden" name="program_id" value={programId} />
                <input type="hidden" name="program_slug" value={programSlug} />
                <input type="hidden" name="student_id" value={student.id} />
                <div className="min-w-0">
                  <p className="text-sm text-ink">{student.name}</p>
                  <p className="text-xs text-ink-muted">{student.email}</p>
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="shrink-0 text-sm text-ink hover:text-accent disabled:opacity-60"
                >
                  {pending ? "Adding…" : "Select"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function RemoveStudentDialog({
  programId,
  programSlug,
  row,
  onClose,
}: {
  programId: string;
  programSlug: string;
  row: AdminRegistrationRow;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(
    removeStudentRegistration,
    initialState,
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, pending]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={() => {
        if (!pending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-student-title"
        className="w-full max-w-md border border-ink/10 bg-paper p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="remove-student-title" className="text-xl">
          Remove this student?
        </h3>
        <p className="mt-3 text-sm text-ink-muted">
          Remove {row.name} from this program? Their registration will be
          cancelled, not deleted.
        </p>
        <AuthMessage state={state} />
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/15 px-4 text-sm text-ink hover:border-accent"
            onClick={onClose}
            disabled={pending}
          >
            Cancel
          </button>
          <form action={action}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="program_id" value={programId} />
            <input type="hidden" name="program_slug" value={programSlug} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper hover:bg-ink-muted disabled:opacity-60"
            >
              {pending ? "Removing…" : "Remove"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
