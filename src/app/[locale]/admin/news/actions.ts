"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { parseUuid } from "@/lib/form-input";
import { newsWriteErrorMessage, parseNewsForm } from "@/lib/news-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type NewsActionState = {
  error?: string;
  success?: string;
};

function revalidateNewsPaths(slug?: string, id?: string) {
  revalidateLocalized("/admin/news");
  revalidateLocalized("/news");
  revalidateLocalized("/");
  if (slug) {
    revalidateLocalized(`/news/${slug}`);
  }
  if (id) {
    revalidateLocalized(`/admin/news/${id}/edit`);
  }
}

export async function createArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const parsed = await parseNewsForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("news_articles").insert(parsed.data);
  if (error) {
    console.error("Create article failed:", error);
    return { error: await newsWriteErrorMessage(error) };
  }

  revalidateNewsPaths(parsed.data.slug);
  return redirect("/admin/news");
}

export async function updateArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundArticle"));
  if ("error" in id) {
    return { error: id.error };
  }

  const parsed = await parseNewsForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("news_articles")
    .update(parsed.data)
    .eq("id", id.id);
  if (error) {
    console.error("Update article failed:", error);
    return { error: await newsWriteErrorMessage(error) };
  }

  revalidateNewsPaths(parsed.data.slug, id.id);
  return { success: t("articleSaved") };
}

export async function archiveArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("notFoundArticle"));
  if ("error" in id) {
    return { error: id.error };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_articles")
    .update({ published: false })
    .eq("id", id.id)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    console.error("Archive article failed:", error);
    return { error: t("archiveArticle") };
  }

  revalidateNewsPaths(data.slug, id.id);
  return redirect("/admin/news");
}
