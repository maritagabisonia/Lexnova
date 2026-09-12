"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newsWriteErrorMessage, parseNewsForm } from "@/lib/news-fields";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type NewsActionState = {
  error?: string;
  success?: string;
};

function revalidateNewsPaths(slug?: string, id?: string) {
  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/news/${slug}`);
  }
  if (id) {
    revalidatePath(`/admin/news/${id}/edit`);
  }
}

export async function createArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const parsed = parseNewsForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("news_articles").insert(parsed.data);
  if (error) {
    console.error("Create article failed:", error);
    return { error: newsWriteErrorMessage(error) };
  }

  revalidateNewsPaths(parsed.data.slug);
  redirect("/admin/news");
}

export async function updateArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that article." };
  }

  const parsed = parseNewsForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("news_articles")
    .update(parsed.data)
    .eq("id", id);
  if (error) {
    console.error("Update article failed:", error);
    return { error: newsWriteErrorMessage(error) };
  }

  revalidateNewsPaths(parsed.data.slug, id);
  return { success: "Article saved." };
}

export async function archiveArticle(
  _prev: NewsActionState,
  formData: FormData,
): Promise<NewsActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "We could not find that article." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_articles")
    .update({ published: false })
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error || !data) {
    console.error("Archive article failed:", error);
    return { error: "We could not archive this article. Please try again." };
  }

  revalidateNewsPaths(data.slug, id);
  redirect("/admin/news");
}
