export type AdminSessionValues = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
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
  format: "online" | "in_person" | "hybrid";
  lecturer_id: string | null;
};

export function parseSessionForm(
  formData: FormData,
): { data: SessionWritePayload } | { error: string } {
  const programId = String(formData.get("program_id") ?? "").trim();
  const sessionDate = String(formData.get("session_date") ?? "").trim();
  const startTime = toTimeInput(String(formData.get("start_time") ?? ""));
  const endTime = toTimeInput(String(formData.get("end_time") ?? ""));
  const format = String(formData.get("format") ?? "");
  const lecturerId = String(formData.get("lecturer_id") ?? "").trim();

  if (!programId) {
    return { error: "We could not find that program." };
  }
  if (!sessionDate) {
    return { error: "Please choose a date." };
  }
  if (!startTime || !endTime) {
    return { error: "Please enter a start and end time." };
  }
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (startMinutes == null || endMinutes == null) {
    return { error: "Please enter valid start and end times." };
  }
  if (endMinutes <= startMinutes) {
    return { error: "End time must be after start time." };
  }
  if (format !== "online" && format !== "in_person" && format !== "hybrid") {
    return { error: "Please choose a format." };
  }

  return {
    data: {
      program_id: programId,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      location: emptyToNull(String(formData.get("location") ?? "")),
      format,
      lecturer_id: lecturerId || null,
    },
  };
}

export function sessionWriteErrorMessage(error: { code?: string; message?: string } | null) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23503" && message.includes("lecturer")) {
    return "Please choose a valid lecturer.";
  }
  if (code === "23503") {
    return "We could not find that program.";
  }
  if (code === "23514" || message.includes("check constraint")) {
    return "End time must be after start time.";
  }
  return "We could not save this session. Please try again.";
}
