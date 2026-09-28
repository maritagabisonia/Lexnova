import { getTranslations } from "next-intl/server";
import { FIELD_MAX, isIsoDate, isUuid } from "@/lib/form-input";

export type AdminSessionValues = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  location_ka: string;
  format: "online" | "in_person" | "hybrid";
  lecturer_id: string;
};

export function toTimeInput(value: string | null | undefined) {
  if (!value) {
    return "";
  }
  const [hours, minutes] = value.split(":");
  if (hours == null || minutes == null) {
    return value;
  }
  return `${hours.padStart(2, "0")}:${minutes.slice(0, 2).padStart(2, "0")}`;
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

export type SessionWritePayload = {
  program_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  location_ka: string | null;
  format: "online" | "in_person" | "hybrid";
  lecturer_id: string | null;
};

export async function parseSessionForm(
  formData: FormData,
): Promise<{ data: SessionWritePayload } | { error: string }> {
  const t = await getTranslations("admin.errors");
  const fields = await getTranslations("admin.form");
  const programId = String(formData.get("program_id") ?? "").trim();
  const sessionDate = String(formData.get("session_date") ?? "").trim();
  const startTime = toTimeInput(String(formData.get("start_time") ?? ""));
  const endTime = toTimeInput(String(formData.get("end_time") ?? ""));
  const format = String(formData.get("format") ?? "");
  const lecturerId = String(formData.get("lecturer_id") ?? "").trim();

  if (!isUuid(programId)) {
    return { error: t("notFoundProgram") };
  }
  if (!sessionDate) {
    return { error: t("chooseDate") };
  }
  if (!isIsoDate(sessionDate)) {
    return { error: t("validDate") };
  }
  if (!startTime || !endTime) {
    return { error: t("enterTimes") };
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (startMinutes == null || endMinutes == null) {
    return { error: t("validTimes") };
  }
  if (endMinutes <= startMinutes) {
    return { error: t("endAfterStart") };
  }
  if (format !== "online" && format !== "in_person" && format !== "hybrid") {
    return { error: t("chooseFormat") };
  }
  if (lecturerId && !isUuid(lecturerId)) {
    return { error: t("validLecturer") };
  }
  const location = emptyToNull(String(formData.get("location") ?? ""));
  const locationKa = emptyToNull(String(formData.get("location_ka") ?? ""));
  if (location && location.length > FIELD_MAX.shortText) {
    return { error: t("tooLong", { field: fields("location") }) };
  }
  if (locationKa && locationKa.length > FIELD_MAX.shortText) {
    return { error: t("tooLong", { field: fields("location") }) };
  }

  return {
    data: {
      program_id: programId,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      location,
      location_ka: locationKa,
      format,
      lecturer_id: lecturerId || null,
    },
  };
}

export async function sessionWriteErrorMessage(
  error: { code?: string; message?: string } | null,
) {
  const t = await getTranslations("admin.errors");
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23503" && message.includes("lecturer")) {
    return t("validLecturer");
  }
  if (code === "23503") {
    return t("notFoundProgram");
  }
  if (code === "23514" || message.includes("check constraint")) {
    return t("endAfterStart");
  }
  return t("saveSession");
}
