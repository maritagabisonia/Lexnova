"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
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
  revalidateLocalized("/admin");
  revalidateLocalized("/admin/programs");
  revalidateLocalized("/programs");
  revalidateLocalized("/dashboard/courses");
  revalidateLocalized("/dashboard/calendar");
  if (slug) {
    revalidateLocalized(`/programs/${slug}`);
  }
  if (programId) {
    revalidateLocalized(`/admin/programs/${programId}/edit`);
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
  const t = await getTranslations("admin.errors");
  const programId = parseUuid(String(formData.get("program_id") ?? ""), t("chooseStudent"));
  const studentId = parseUuid(String(formData.get("student_id") ?? ""), t("chooseStudent"));
  const slug = String(formData.get("program_slug") ?? "").trim();
  if ("error" in programId || "error" in studentId) {
    return { error: t("chooseStudent") };
  }

  const supabase = createServiceClient();
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", studentId.id)
    .maybeSingle();

  if (studentError || !student || student.role !== "student") {
    return { error: t("validStudent") };
  }

  const { data: existing, error: existingError } = await supabase
    .from("registrations")
    .select("id, status")
    .eq("program_id", programId.id)
    .eq("student_id", studentId.id)
    .maybeSingle();

  if (existingError) {
    console.error("Admin add registration lookup failed:", existingError);
    return { error: t("addStudent") };
  }

  if (existing?.status === "confirmed") {
    return { error: t("alreadyRegistered") };
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
      return { error: t("addStudent") };
    }
  } else {
    const { error } = await supabase.from("registrations").insert({
      program_id: programId.id,
      student_id: studentId.id,
      status: "confirmed",
    });
    if (error) {
      if (error.code === "23505") {
        return { error: t("alreadyRegistered") };
      }
      console.error("Admin add registration failed:", error);
      return { error: t("addStudent") };
    }
  }

  revalidateRegistrationPaths(slug, programId.id);
  return redirect(studentsPath(programId.id, "added"));
}

export async function removeStudentRegistration(
  _prev: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundRegistration"));
  const programId = parseUuid(String(formData.get("program_id") ?? ""), t("notFoundRegistration"));
  const slug = String(formData.get("program_slug") ?? "").trim();
  if ("error" in id || "error" in programId) {
    return { error: t("notFoundRegistration") };
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
    return { error: t("removeStudent") };
  }

  revalidateRegistrationPaths(slug, programId.id);
  return redirect(studentsPath(programId.id, "removed"));
}
