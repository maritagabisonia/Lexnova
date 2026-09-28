"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { parseUuid } from "@/lib/form-input";
import {
  parseProgramForm,
  programWriteErrorMessage,
} from "@/lib/program-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type ProgramActionState = {
  error?: string;
  success?: string;
};

function revalidateProgramPaths(slug?: string, id?: string) {
  revalidateLocalized("/admin");
  revalidateLocalized("/admin/programs");
  revalidateLocalized("/programs");
  if (slug) {
    revalidateLocalized(`/programs/${slug}`);
  }
  if (id) {
    revalidateLocalized(`/admin/programs/${id}/edit`);
  }
  revalidateLocalized("/dashboard", "layout");
}

export async function createProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const parsed = await parseProgramForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("programs").insert(parsed.data);
  if (error) {
    console.error("Create program failed:", error);
    return { error: await programWriteErrorMessage(error) };
  }

  revalidateProgramPaths(parsed.data.slug);
  return redirect("/admin/programs");
}

export async function updateProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundProgram"));
  if ("error" in id) {
    return { error: id.error };
  }

  const parsed = await parseProgramForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("programs")
    .update(parsed.data)
    .eq("id", id.id);
  if (error) {
    console.error("Update program failed:", error);
    return { error: await programWriteErrorMessage(error) };
  }

  revalidateProgramPaths(parsed.data.slug, id.id);
  return { success: t("programSaved") };
}

export async function archiveProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundProgram"));
  if ("error" in id) {
    return { error: id.error };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("programs")
    .update({ status: "archived" })
    .eq("id", id.id)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    console.error("Archive program failed:", error);
    return { error: t("archiveProgram") };
  }

  revalidateProgramPaths(data.slug, id.id);
  return redirect("/admin/programs");
}

export async function deleteProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundProgram"));
  if ("error" in id) {
    return { error: id.error };
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("programs")
    .select("slug")
    .eq("id", id.id)
    .maybeSingle();

  const { error } = await supabase.from("programs").delete().eq("id", id.id);
  if (error) {
    console.error("Delete program failed:", error);
    return {
      error: t("deleteProgram"),
    };
  }

  revalidateProgramPaths(existing?.slug, id.id);
  return redirect("/admin/programs");
}
