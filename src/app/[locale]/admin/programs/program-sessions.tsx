"use client";

import { useActionState, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AuthMessage } from "@/components/auth-form";
import { TranslationPair } from "@/components/admin-translation-pair";
import {
  programFormatOptions,
  type AdminLecturerOption,
} from "@/lib/program-fields";
import {
  formatDate,
  formatTime,
  translatedFormatLabel,
} from "@/lib/program-display";
import type { AdminSessionValues } from "@/lib/session-fields";
import {
  createSession,
  deleteSession,
  updateSession,
  type SessionActionState,
} from "./session-actions";

const inputClass =
  "min-h-11 w-full rounded-sm border border-ink/15 bg-paper px-3 py-2 text-ink outline-none focus:border-accent";

const initialState: SessionActionState = {};

export function ProgramSessions({
  programId,
  programSlug,
  programFormat,
  programLocation,
  programLecturerId,
  lecturers,
  sessions,
  notice,
}: {
  programId: string;
  programSlug: string;
  programFormat: "online" | "in_person" | "hybrid";
  programLocation: string;
  programLecturerId: string;
  lecturers: AdminLecturerOption[];
  sessions: AdminSessionValues[];
  notice?: string;
}) {
  const t = useTranslations("admin.form");
  const admin = useTranslations("admin");
  const programsT = useTranslations("programs");
  const locale = useLocale();
  const [editor, setEditor] = useState<"create" | AdminSessionValues | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminSessionValues | null>(
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
          <h2 className="text-2xl">{t("sessions")}</h2>
          <p className="mt-2 text-sm text-ink-muted">
            {t("sessionsLead")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditor("create")}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper hover:bg-ink-muted"
        >
          {t("addSession")}
        </button>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-6 text-sm text-ink-muted">{t("noSessions")}</p>
      ) : (
        <>
          <ul className="mt-6 space-y-3 sm:hidden">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
              >
                <p className="text-ink">
                  {formatDate(session.session_date, locale) ?? session.session_date}
                </p>
                <p className="mt-1 text-ink-muted">
                  {formatTime(session.start_time)} – {formatTime(session.end_time)}
                </p>
                <p className="mt-1 text-ink-muted">
                  {translatedFormatLabel(session.format, programsT)}
                  {session.location ? ` · ${session.location}` : ""}
                </p>
                <p className="mt-1 text-ink-muted">
                  {lecturerLabel(session.lecturer_id, programLecturerId, lecturers)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setEditor(session)}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {admin("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(session)}
                    className="text-sm text-ink hover:text-accent"
                  >
                    {t("delete")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
                  <th className="py-2 pr-4 font-medium">{admin("date")}</th>
                  <th className="py-2 pr-4 font-medium">{t("startTime")}</th>
                  <th className="py-2 pr-4 font-medium">{t("format")}</th>
                  <th className="py-2 pr-4 font-medium">{t("location")}</th>
                  <th className="py-2 pr-4 font-medium">{t("lecturer")}</th>
                  <th className="py-2 font-medium">
                    <span className="sr-only">{admin("actions")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b border-ink/10">
                    <td className="whitespace-nowrap py-3 pr-4 text-ink">
                      {formatDate(session.session_date, locale) ?? session.session_date}
                    </td>
                    <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                      {formatTime(session.start_time)} – {formatTime(session.end_time)}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {translatedFormatLabel(session.format, programsT)}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {session.location || "—"}
                    </td>
                    <td className="py-3 pr-4 text-ink-muted">
                      {lecturerLabel(
                        session.lecturer_id,
                        programLecturerId,
                        lecturers,
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setEditor(session)}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {admin("edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(session)}
                          className="text-sm text-ink hover:text-accent"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editor ? (
        <SessionEditorDialog
          key={editor === "create" ? "create" : editor.id}
          mode={editor === "create" ? "create" : "edit"}
          programId={programId}
          programSlug={programSlug}
          lecturers={lecturers}
          session={
            editor === "create"
              ? {
                  id: "",
                  session_date: "",
                  start_time: "",
                  end_time: "",
                  location: programLocation,
                  location_ka: "",
                  format: programFormat,
                  lecturer_id: "",
                }
              : editor
          }
          onClose={() => setEditor(null)}
        />
      ) : null}

      {pendingDelete ? (
        <DeleteSessionDialog
          programId={programId}
          programSlug={programSlug}
          session={pendingDelete}
          onClose={() => setPendingDelete(null)}
        />
      ) : null}
    </div>
  );
}

function lecturerLabel(
  sessionLecturerId: string,
  programLecturerId: string,
  lecturers: AdminLecturerOption[],
) {
  const id = sessionLecturerId || programLecturerId;
  return lecturers.find((lecturer) => lecturer.id === id)?.fullName ?? "—";
}

function SessionEditorDialog({
  mode,
  programId,
  programSlug,
  lecturers,
  session,
  onClose,
}: {
  mode: "create" | "edit";
  programId: string;
  programSlug: string;
  lecturers: AdminLecturerOption[];
  session: AdminSessionValues;
  onClose: () => void;
}) {
  const t = useTranslations("admin.form");
  const admin = useTranslations("admin");
  const programsT = useTranslations("programs");
  const action = mode === "create" ? createSession : updateSession;
  const [state, formAction, pending] = useActionState(action, initialState);

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
        aria-labelledby="session-editor-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-ink/10 bg-paper p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="session-editor-title" className="text-xl">
          {mode === "create" ? t("addSession") : t("editSession")}
        </h3>
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="program_id" value={programId} />
          <input type="hidden" name="program_slug" value={programSlug} />
          {mode === "edit" ? <input type="hidden" name="id" value={session.id} /> : null}
          <AuthMessage state={state} />
          <Field
            id="session_date"
            label={admin("date")}
            type="date"
            defaultValue={session.session_date}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="start_time"
              label={t("startTime")}
              type="time"
              defaultValue={session.start_time}
            />
            <Field
              id="end_time"
              label={t("endTime")}
              type="time"
              defaultValue={session.end_time}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="session_format" className="block text-sm text-ink">
              {t("format")}
            </label>
            <select
              id="session_format"
              name="format"
              required
              defaultValue={session.format}
              className={inputClass}
            >
              {programFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {translatedFormatLabel(option.value, programsT)}
                </option>
              ))}
            </select>
          </div>
          <TranslationPair
            name="location"
            label={t("location")}
            englishDefault={session.location}
            georgianDefault={session.location_ka}
          />
          <div className="space-y-1.5">
            <label htmlFor="session_lecturer" className="block text-sm text-ink">
              {t("lecturerOverride")}
            </label>
            <select
              id="session_lecturer"
              name="lecturer_id"
              defaultValue={session.lecturer_id}
              className={inputClass}
            >
              <option value="">{t("programLecturer")}</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/15 px-4 text-sm text-ink hover:border-accent"
              onClick={onClose}
              disabled={pending}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper hover:bg-ink-muted disabled:opacity-60"
            >
              {pending
                ? t("saving")
                : mode === "create"
                  ? t("addSession")
                  : t("saveSession")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteSessionDialog({
  programId,
  programSlug,
  session,
  onClose,
}: {
  programId: string;
  programSlug: string;
  session: AdminSessionValues;
  onClose: () => void;
}) {
  const t = useTranslations("admin.form");
  const locale = useLocale();
  const [state, action, pending] = useActionState(deleteSession, initialState);
  const dateLabel = formatDate(session.session_date, locale) ?? session.session_date;

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
        aria-labelledby="delete-session-title"
        className="w-full max-w-md border border-ink/10 bg-paper p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="delete-session-title" className="text-xl">
          {t("deleteSessionTitle")}
        </h3>
        <p className="mt-3 text-sm text-ink-muted">
          {t("deleteSessionBody", {
            date: dateLabel,
            start: formatTime(session.start_time) ?? session.start_time,
            end: formatTime(session.end_time) ?? session.end_time,
          })}
        </p>
        <AuthMessage state={state} />
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink/15 px-4 text-sm text-ink hover:border-accent"
            onClick={onClose}
            disabled={pending}
          >
            {t("cancel")}
          </button>
          <form action={action}>
            <input type="hidden" name="id" value={session.id} />
            <input type="hidden" name="program_id" value={programId} />
            <input type="hidden" name="program_slug" value={programSlug} />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-4 text-sm text-paper hover:bg-ink-muted disabled:opacity-60"
            >
              {pending ? t("deleting") : t("delete")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  defaultValue,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
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
        type={type}
        required={required}
        defaultValue={defaultValue}
        step={type === "time" ? 60 : undefined}
        className={inputClass}
      />
    </div>
  );
}
