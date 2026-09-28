"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { parseUuid } from "@/lib/form-input";
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
  revalidateLocalized("/admin/lecturers");
  revalidateLocalized("/admin/programs");
  revalidateLocalized("/admin/programs/new");
  revalidateLocalized("/programs");
  revalidateLocalized("/about");
  if (id) {
    revalidateLocalized(`/admin/lecturers/${id}/edit`);
    revalidateLocalized("/admin/programs", "layout");
  }
}

export async function createLecturer(
  _prev: LecturerActionState,
  formData: FormData,
): Promise<LecturerActionState> {
  await requireAdmin();
  const parsed = await parseLecturerForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("lecturers").insert(parsed.data);
  if (error) {
    console.error("Create lecturer failed:", error);
    return { error: await lecturerWriteErrorMessage(error) };
  }

  revalidateLecturerPaths();
  return redirect("/admin/lecturers");
}

export async function updateLecturer(
  _prev: LecturerActionState,
  formData: FormData,
): Promise<LecturerActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundLecturer"));
  if ("error" in id) {
    return { error: id.error };
  }

  const parsed = await parseLecturerForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("lecturers")
    .update(parsed.data)
    .eq("id", id.id);
  if (error) {
    console.error("Update lecturer failed:", error);
    return { error: await lecturerWriteErrorMessage(error) };
  }

  revalidateLecturerPaths(id.id);
  return { success: t("lecturerSaved") };
}
