import { cache } from "react";
import { formatDate, typeLabel, statusLabel } from "@/lib/program-display";
import {
  type AdminLecturerOption,
  type ProgramFormValues,
} from "@/lib/program-fields";
import { createClient } from "@/lib/supabase/server";

export type { AdminLecturerOption, ProgramFormValues } from "@/lib/program-fields";
export { emptyProgramFormValues } from "@/lib/program-fields";

export type AdminProgramRow = {
  id: string;
  title: string;
  slug: string;
  type: string;
  typeLabel: string;
  status: string;
  statusLabel: string;
  startDate: string | null;
  registeredCount: number;
};

function formatTimestamp(value: string | null) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export const getAdminPrograms = cache(async function getAdminPrograms(): Promise<
  AdminProgramRow[]
> {
  try {
    const supabase = await createClient();
    const [{ data: programs, error: programError }, { data: regs, error: regError }] =
      await Promise.all([
        supabase
          .from("programs")
          .select("id, title, slug, type, status, start_date, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("registrations").select("program_id").eq("status", "confirmed"),
      ]);

    if (programError) {
      console.error("Admin programs list failed:", programError);
      return [];
    }
    if (regError) {
      console.error("Admin registration counts failed:", regError);
    }

    const counts = new Map<string, number>();
    for (const row of regs ?? []) {
      counts.set(row.program_id, (counts.get(row.program_id) ?? 0) + 1);
    }

    return (programs ?? []).map((program) => ({
      id: program.id,
      title: program.title,
      slug: program.slug,
      type: program.type,
      typeLabel: typeLabel(program.type),
      status: program.status,
      statusLabel: statusLabel(program.status),
      startDate: formatDate(program.start_date),
      registeredCount: counts.get(program.id) ?? 0,
    }));
  } catch (error) {
    console.error("Admin programs list failed:", error);
    return [];
  }
});

export const getAdminLecturers = cache(async function getAdminLecturers(): Promise<
  AdminLecturerOption[]
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lecturers")
      .select("id, full_name")
      .order("full_name", { ascending: true });
    if (error || !data) {
      if (error) {
        console.error("Admin lecturers list failed:", error);
      }
      return [];
    }
    return data.map((row) => ({ id: row.id, fullName: row.full_name }));
  } catch (error) {
    console.error("Admin lecturers list failed:", error);
    return [];
  }
});

export const getAdminProgram = cache(async function getAdminProgram(
  id: string,
): Promise<ProgramFormValues | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select(
        "id, type, title, slug, short_description, full_description, target_audience, objectives, learning_outcomes, duration_text, start_date, end_date, registration_deadline, format, location, lecturer_id, max_participants, status, price, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const type = data.type === "training" ? "training" : "course";
    const format =
      data.format === "in_person" || data.format === "hybrid"
        ? data.format
        : "online";

    return {
      id: data.id,
      type,
      title: data.title ?? "",
      slug: data.slug ?? "",
      short_description: data.short_description ?? "",
      full_description: data.full_description ?? "",
      target_audience: data.target_audience ?? "",
      objectives: data.objectives ?? "",
      learning_outcomes: data.learning_outcomes ?? "",
      duration_text: data.duration_text ?? "",
      start_date: data.start_date ?? "",
      end_date: data.end_date ?? "",
      registration_deadline: data.registration_deadline ?? "",
      format,
      location: data.location ?? "",
      lecturer_id: data.lecturer_id ?? "",
      max_participants:
        data.max_participants == null ? "" : String(data.max_participants),
      status: data.status ?? "coming_soon",
      price: data.price == null ? "" : String(data.price),
      created_at: formatTimestamp(data.created_at ?? null),
      updated_at: formatTimestamp(data.updated_at ?? null),
    };
  } catch {
    return null;
  }
});
