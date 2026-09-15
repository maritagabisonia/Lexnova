"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  sanitizeStudentSearch,
  type StudentSearchResult,
} from "@/lib/admin-registrations";
import { parseUuid } from "@/lib/form-input";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type RegistrationActionState = {
  error?: string;
  success?: string;
};

function studentsPath(programId: string, result: "added" | "removed") {
  return `/admin/programs/${programId}/edit?tab=students&registration=${result}`;
}

function revalidateRegistrationPaths(slug?: string, programId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/calendar");
  if (slug) {
    revalidatePath(`/programs/${slug}`);
  }
  if (programId) {
    revalidatePath(`/admin/programs/${programId}/edit`);
  }
}

export async function searchStudentsForProgram(
  programId: string,
  query: string,
): Promise<StudentSearchResult[]> {
  await requireAdmin();
  const program = parseUuid(programId, "");
  const needle = sanitizeStudentSearch(query);
  if (!("id" in program) || needle.length < 2) {
    return [];
  }

  const supabase = createServiceClient();
  const pattern = `%${needle}%`;
  const [
    { data: byName, error: nameError },
    { data: byEmail, error: emailError },
    { data: registered, error: regError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "student")
      .ilike("full_name", pattern)
      .order("full_name", { ascending: true })
      .limit(8),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "student")
      .ilike("email", pattern)
      .order("full_name", { ascending: true })
      .limit(8),
    supabase
      .from("registrations")
      .select("student_id")
      .eq("program_id", program.id)
      .eq("status", "confirmed"),
  ]);

  if (nameError || emailError) {
    console.error("Admin student search failed:", nameError ?? emailError);
    return [];
  }
  if (regError) {
    console.error("Admin student search registrations failed:", regError);
  }

  const taken = new Set((registered ?? []).map((row) => row.student_id));
  const seen = new Set<string>();
  const matches = [...(byName ?? []), ...(byEmail ?? [])].filter((row) => {
    if (taken.has(row.id) || seen.has(row.id)) {
      return false;
    }
    seen.add(row.id);
    return true;
  });

  return matches.slice(0, 8).map((row) => ({
    id: row.id,
    name: row.full_name?.trim() || "Student",
    email: row.email?.trim() || "—",
  }));
}

export async function addStudentRegistration(
  _prev: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  await requireAdmin();
  const programId = parseUuid(String(formData.get("program_id") ?? ""));
  const studentId = parseUuid(String(formData.get("student_id") ?? ""));
  const slug = String(formData.get("program_slug") ?? "").trim();
  if ("error" in programId || "error" in studentId) {
    return { error: "Please choose a student." };
  }

  const supabase = createServiceClient();
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", studentId.id)
    .maybeSingle();

  if (studentError || !student || student.role !== "student") {
    return { error: "Please choose a valid student." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("program_id", programId.id)
    .eq("student_id", studentId.id)
    .maybeSingle();

  if (existingError) {
    console.error("Admin add registration lookup failed:", existingError);
    return { error: "We could not add this student. Please try again." };
  }

  if (existing?.status === "confirmed") {
    return { error: "That student is already registered." };
  }

  if (existing) {
    const { error } = await supabase
      .from("registrations")
      .update({
        status: "confirmed",
        registered_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("program_id", programId.id);
    if (error) {
      console.error("Admin reconfirm registration failed:", error);
      return { error: "We could not add this student. Please try again." };
    }
  } else {
    const { error } = await supabase.from("registrations").insert({
      program_id: programId.id,
      student_id: studentId.id,
      status: "confirmed",
    });
    if (error) {
      if (error.code === "23505") {
        return { error: "That student is already registered." };
      }
      console.error("Admin add registration failed:", error);
      return { error: "We could not add this student. Please try again." };
    }
  }

  revalidateRegistrationPaths(slug, programId.id);
  redirect(studentsPath(programId.id, "added"));
}

export async function removeStudentRegistration(
  _prev: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  await requireAdmin();
  const id = parseUuid(String(formData.get("id") ?? ""));
  const programId = parseUuid(String(formData.get("program_id") ?? ""));
  const slug = String(formData.get("program_slug") ?? "").trim();
  if ("error" in id || "error" in programId) {
    return { error: "We could not find that registration." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("registrations")
    .update({ status: "cancelled" })
    .eq("id", id.id)
    .eq("program_id", programId.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Admin cancel registration failed:", error);
    return { error: "We could not remove this student. Please try again." };
  }

  revalidateRegistrationPaths(slug, programId.id);
  redirect(studentsPath(programId.id, "removed"));
}
