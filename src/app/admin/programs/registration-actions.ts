"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  sanitizeStudentSearch,
  type StudentSearchResult,
} from "@/lib/admin-registrations";
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
  const needle = sanitizeStudentSearch(query);
  if (!programId || needle.length < 2) {
    return [];
  }

  const supabase = createServiceClient();
  const pattern = `%${needle}%`;
  const [{ data: matches, error: searchError }, { data: registered, error: regError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "student")
        .or(`full_name.ilike."${pattern}",email.ilike."${pattern}"`)
        .order("full_name", { ascending: true })
        .limit(8),
      supabase
        .from("registrations")
        .select("student_id")
        .eq("program_id", programId)
        .eq("status", "confirmed"),
    ]);

  if (searchError) {
    console.error("Admin student search failed:", searchError);
    return [];
  }
  if (regError) {
    console.error("Admin student search registrations failed:", regError);
  }

  const taken = new Set((registered ?? []).map((row) => row.student_id));
  return (matches ?? [])
    .filter((row) => !taken.has(row.id))
    .map((row) => ({
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
  const programId = String(formData.get("program_id") ?? "").trim();
  const studentId = String(formData.get("student_id") ?? "").trim();
  const slug = String(formData.get("program_slug") ?? "").trim();
  if (!programId || !studentId) {
    return { error: "Please choose a student." };
  }

  const supabase = createServiceClient();
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", studentId)
    .maybeSingle();

  if (studentError || !student || student.role !== "student") {
    return { error: "Please choose a valid student." };
  }

  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("program_id", programId)
    .eq("student_id", studentId)
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
      .eq("program_id", programId);
    if (error) {
      console.error("Admin reconfirm registration failed:", error);
      return { error: "We could not add this student. Please try again." };
    }
  } else {
    const { error } = await supabase.from("registrations").insert({
      program_id: programId,
      student_id: studentId,
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

  revalidateRegistrationPaths(slug, programId);
  redirect(studentsPath(programId, "added"));
}

export async function removeStudentRegistration(
  _prev: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const programId = String(formData.get("program_id") ?? "").trim();
  const slug = String(formData.get("program_slug") ?? "").trim();
  if (!id || !programId) {
    return { error: "We could not find that registration." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("registrations")
    .update({ status: "cancelled" })
    .eq("id", id)
    .eq("program_id", programId)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Admin cancel registration failed:", error);
    return { error: "We could not remove this student. Please try again." };
  }

  revalidateRegistrationPaths(slug, programId);
  redirect(studentsPath(programId, "removed"));
}
