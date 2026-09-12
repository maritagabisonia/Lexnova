"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  lecturerWriteErrorMessage,
  parseLecturerForm,
} from "@/lib/lecturer-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type LecturerActionState = {
  error?: string;
  success?: string;
};

function revalidateLecturerPaths(id?: string) {
  revalidatePath("/admin/lecturers");
  revalidatePath("/admin/programs");
  revalidatePath("/admin/programs/new");
  revalidatePath("/programs");
  revalidatePath("/about");
  if (id) {
    revalidatePath(`/admin/lecturers/${id}/edit`);
    revalidatePath("/admin/programs", "layout");
  }
}

export async function createLecturer(
  _prev: LecturerActionState,
  formData: FormData,
): Promise<LecturerActionState> {
  await requireAdmin();
  const parsed = parseLecturerForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("lecturers").insert(parsed.data);
  if (error) {
    console.error("Create lecturer failed:", error);
    return { error: lecturerWriteErrorMessage(error) };
  }

  revalidateLecturerPaths();
  redirect("/admin/lecturers");
}

export async function updateLecturer(
  _prev: LecturerActionState,
  formData: FormData,
): Promise<LecturerActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that lecturer." };
  }

  const parsed = parseLecturerForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lecturers")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    console.error("Update lecturer failed:", error);
    return { error: lecturerWriteErrorMessage(error) };
  }

  revalidateLecturerPaths(id);
  return { success: "Lecturer saved." };
}
