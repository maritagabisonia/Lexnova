"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { parseUuid } from "@/lib/form-input";
import { faqWriteErrorMessage, parseFaqForm } from "@/lib/faq-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type FaqActionState = {
  error?: string;
  success?: string;
};

function revalidateFaqPaths(id?: string) {
  revalidateLocalized("/admin/faq");
  revalidateLocalized("/contact");
  if (id) {
    revalidateLocalized(`/admin/faq/${id}/edit`);
  }
}

export async function createFaqItem(
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  await requireAdmin();
  const parsed = await parseFaqForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { data: last } = await supabase
    .from("faq_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (last?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("faq_items").insert({
    ...parsed.data,
    sort_order: sortOrder,
  });
  if (error) {
    console.error("Create FAQ item failed:", error);
    return { error: await faqWriteErrorMessage(error) };
  }

  revalidateFaqPaths();
  return redirect("/admin/faq");
}

export async function updateFaqItem(
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundFaq"));
  if ("error" in id) {
    return { error: id.error };
  }

  const parsed = await parseFaqForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("faq_items")
    .update(parsed.data)
    .eq("id", id.id);
  if (error) {
    console.error("Update FAQ item failed:", error);
    return { error: await faqWriteErrorMessage(error) };
  }

  revalidateFaqPaths(id.id);
  return { success: t("faqSaved") };
}

export async function deleteFaqItem(
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundFaq"));
  if ("error" in id) {
    return { error: id.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("faq_items").delete().eq("id", id.id);
  if (error) {
    console.error("Delete FAQ item failed:", error);
    return { error: t("deleteFaq") };
  }

  revalidateFaqPaths();
  return redirect("/admin/faq");
}

export async function moveFaqItem(
  _prev: FaqActionState,
  formData: FormData,
): Promise<FaqActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundFaq"));
  if ("error" in id) {
    return { error: id.error };
  }

  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") {
    return { error: t("moveFaq") };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) {
    console.error("Move FAQ item failed:", error);
    return { error: t("moveFaq") };
  }

  const index = data.findIndex((row) => row.id === id.id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= data.length) {
    return {};
  }

  const current = data[index];
  const neighbor = data[swapIndex];
  const { error: firstError } = await supabase
    .from("faq_items")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  const { error: secondError } = await supabase
    .from("faq_items")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);
  if (firstError || secondError) {
    console.error("Move FAQ item failed:", firstError ?? secondError);
    return { error: t("moveFaq") };
  }

  revalidateFaqPaths();
  return {};
}
