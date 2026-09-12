"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/dashboard/calendar");
  if (slug) {
    revalidatePath(`/programs/${slug}`);
  }
  if (programId) {
    revalidatePath(`/admin/programs/${programId}/edit`);
  }
}

export async function createSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const parsed = parseSessionForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const slug = String(formData.get("program_slug") ?? "").trim();
  const supabase = createServiceClient();
  const { error } = await supabase.from("program_sessions").insert(parsed.data);
  if (error) {
    console.error("Create session failed:", error);
    return { error: sessionWriteErrorMessage(error) };
  }

  revalidateSessionPaths(slug, parsed.data.program_id);
  redirect(editPath(parsed.data.program_id, "added"));
}

export async function updateSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that session." };
  }

  const parsed = parseSessionForm(formData);
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
    .eq("id", id)
    .eq("program_id", parsed.data.program_id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    console.error("Update session failed:", error);
    return { error: sessionWriteErrorMessage(error) };
  }

  revalidateSessionPaths(slug, parsed.data.program_id);
  redirect(editPath(parsed.data.program_id, "saved"));
}

export async function deleteSession(
  _prev: SessionActionState,
  formData: FormData,
): Promise<SessionActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const programId = String(formData.get("program_id") ?? "").trim();
  const slug = String(formData.get("program_slug") ?? "").trim();
  if (!id || !programId) {
    return { error: "We could not find that session." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("program_sessions")
    .delete()
    .eq("id", id)
    .eq("program_id", programId);

  if (error) {
    console.error("Delete session failed:", error);
    return { error: "We could not delete this session. Please try again." };
  }

  revalidateSessionPaths(slug, programId);
  redirect(editPath(programId, "deleted"));
}
