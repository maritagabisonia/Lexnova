"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { parseUuid } from "@/lib/form-input";
import { parseSessionForm, sessionWriteErrorMessage } from "@/lib/session-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type SessionActionState = {
  error?: string;
  success?: string;
};

function editPath(programId: string, result: "added" | "saved" | "deleted") {
  return `/admin/programs/${programId}/edit?tab=sessions&session=${result}`;
}

function revalidateSessionPaths(slug?: string, programId?: string) {
  revalidateLocalized("/admin/programs");
  revalidateLocalized("/programs");
  revalidateLocalized("/dashboard/calendar");
  if (slug) {
    revalidateLocalized(`/programs/${slug}`);
  }
  if (programId) {
    revalidateLocalized(`/admin/programs/${programId}/edit`);
  }
}

export async function createSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const parsed = await parseSessionForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const slug = String(formData.get("program_slug") ?? "").trim();
  const supabase = createServiceClient();
  const { error } = await supabase.from("program_sessions").insert(parsed.data);
  if (error) {
    console.error("Create session failed:", error);
    return { error: await sessionWriteErrorMessage(error) };
  }

  revalidateSessionPaths(slug, parsed.data.program_id);
  return redirect(editPath(parsed.data.program_id, "added"));
}

export async function updateSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundSession"));
  if ("error" in id) {
    return { error: id.error };
  }

  const parsed = await parseSessionForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const slug = String(formData.get("program_slug") ?? "").trim();
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("program_sessions")
    .update({
      session_date: parsed.data.session_date,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      location: parsed.data.location,
      format: parsed.data.format,
      lecturer_id: parsed.data.lecturer_id,
    })
    .eq("id", id.id)
    .eq("program_id", parsed.data.program_id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Update session failed:", error);
    return { error: await sessionWriteErrorMessage(error) };
  }

  revalidateSessionPaths(slug, parsed.data.program_id);
  return redirect(editPath(parsed.data.program_id, "saved"));
}

export async function deleteSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundSession"));
  const programId = parseUuid(String(formData.get("program_id") ?? ""), t("notFoundSession"));
  const slug = String(formData.get("program_slug") ?? "").trim();
  if ("error" in id || "error" in programId) {
    return { error: t("notFoundSession") };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("program_sessions")
    .delete()
    .eq("id", id.id)
    .eq("program_id", programId.id);

  if (error) {
    console.error("Delete session failed:", error);
    return { error: t("deleteSession") };
  }

  revalidateSessionPaths(slug, programId.id);
  return redirect(editPath(programId.id, "deleted"));
}
