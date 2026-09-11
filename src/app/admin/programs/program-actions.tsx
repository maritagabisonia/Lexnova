"use client";

import { useActionState, useEffect, useState } from "react";
import { AuthMessage } from "@/components/auth-form";
import { archiveProgram, deleteProgram, type ProgramActionState } from "./actions";

const initialState: ProgramActionState = {};

export function ArchiveProgramButton({
  programId,
  compact = false,
}: {
  programId: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState(archiveProgram, initialState);

  return (
    <form action={action} className={compact ? "inline" : "space-y-2"}>
      <input type="hidden" name="id" value={programId} />
      {state.error ? (
        compact ? (
          <span role="alert" className="mr-2 text-xs text-ink">
            {state.error}
          </span>
        ) : (
          <AuthMessage state={state} />
        )
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className={
          compact
            ? "text-sm text-ink hover:text-accent disabled:opacity-60"
            : "inline-flex min-h-11 items-center text-sm text-ink hover:text-accent disabled:opacity-60"
        }
      >
        {pending ? "Archiving…" : "Archive"}
      </button>
    </form>
  );
}

export function DeleteProgramButton({
  programId,
  title,
}: {
  programId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteProgram, initialState);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mt-12 border-t border-ink/10 pt-8">
      <h2 className="text-xl">Delete permanently</h2>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        This removes the program and its sessions. Registrations for this
        program are also deleted. This cannot be undone.
      </p>
      <AuthMessage state={state} />
      <button
        type="button"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/20 px-4 text-sm text-ink hover:border-accent"
        onClick={() => setOpen(true)}
      >
        Delete Permanently
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
            aria-labelledby="delete-program-title"
            className="w-full max-w-md border border-ink/10 bg-paper p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-program-title" className="text-xl">
              Delete this program?
            </h3>
            <p className="mt-3 text-sm text-ink-muted">
              Delete “{title}” permanently? This cannot be undone.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/15 px-4 text-sm text-ink hover:border-accent"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancel
              </button>
              <form action={action}>
                <input type="hidden" name="id" value={programId} />
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper hover:bg-ink-muted disabled:opacity-60"
                >
                  {pending ? "Deleting…" : "Delete Permanently"}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
