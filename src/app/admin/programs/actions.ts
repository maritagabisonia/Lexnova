"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  if (slug) {
    revalidatePath(`/programs/${slug}`);
  }
  if (id) {
    revalidatePath(`/admin/programs/${id}/edit`);
  }
  revalidatePath("/dashboard", "layout");
}

export async function createProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const parsed = parseProgramForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("programs").insert(parsed.data);
  if (error) {
    console.error("Create program failed:", error);
    return { error: programWriteErrorMessage(error) };
  }

  revalidateProgramPaths(parsed.data.slug);
  redirect("/admin/programs");
}

export async function updateProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that program." };
  }

  const parsed = parseProgramForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("programs")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    console.error("Update program failed:", error);
    return { error: programWriteErrorMessage(error) };
  }

  revalidateProgramPaths(parsed.data.slug, id);
  return { success: "Program saved." };
}

export async function archiveProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that program." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("programs")
    .update({ status: "archived" })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    console.error("Archive program failed:", error);
    return { error: "We could not archive this program. Please try again." };
  }

  revalidateProgramPaths(data.slug, id);
  redirect("/admin/programs");
}

export async function deleteProgram(
  _prev: ProgramActionState,
  formData: FormData,
): Promise<ProgramActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that program." };
  }

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("programs")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) {
    console.error("Delete program failed:", error);
    return {
      error: "We could not delete this program. Please try again.",
    };
  }

  revalidateProgramPaths(existing?.slug, id);
  redirect("/admin/programs");
}
