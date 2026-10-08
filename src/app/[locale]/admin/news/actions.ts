"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { redirect } from "@/i18n/redirect";
import { FIELD_MAX, isHttpUrl, isUuid, parseUuid } from "@/lib/form-input";
import { newsWriteErrorMessage, parseNewsForm } from "@/lib/news-fields";
import {
  NEWS_IMAGE_BUCKET,
  NEWS_IMAGE_MAX_BYTES,
  newsImageContentType,
  newsImageExtension,
} from "@/lib/news-image";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type NewsActionState = {
  error?: string;
  success?: string;
};

export type NewsImageUploadState = {
  id?: string;
  url?: string;
  error?: string;
};

export type NewsImageMutationState = {
  error?: string;
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

function parseGalleryUrls(formData: FormData): string[] | { error: true } {
  const raw = String(formData.get("gallery_urls") ?? "").trim();
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { error: true };
    }
    const urls: string[] = [];
    for (const item of parsed) {
      if (typeof item !== "string") {
        return { error: true };
      }
      const url = item.trim();
      if (!url) {
        continue;
      }
      if (!isHttpUrl(url) || url.length > FIELD_MAX.url) {
        return { error: true };
      }
      urls.push(url);
    }
    return urls;
  } catch {
    return { error: true };
  }
}

async function syncCoverImageUrl(
  supabase: ReturnType<typeof createServiceClient>,
  newsId: string,
) {
  const { data } = await supabase
    .from("news_images")
    .select("url")
    .eq("news_id", newsId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const { error } = await supabase
    .from("news_articles")
    .update({ cover_image_url: data?.url ?? null })
    .eq("id", newsId);
  if (error) {
    console.error("Sync news cover image failed:", error);
  }
}

async function revalidateArticleById(
  supabase: ReturnType<typeof createServiceClient>,
  newsId: string,
) {
  const { data } = await supabase
    .from("news_articles")
    .select("slug")
    .eq("id", newsId)
    .maybeSingle();
  revalidateNewsPaths(data?.slug, newsId);
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

  const galleryUrls = parseGalleryUrls(formData);
  if ("error" in galleryUrls) {
    return { error: await newsWriteErrorMessage(null) };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_articles")
    .insert({
      ...parsed.data,
      cover_image_url: galleryUrls[0] ?? parsed.data.cover_image_url,
    })
    .select("id")
    .single();
  if (error || !data) {
    console.error("Create article failed:", error);
    return { error: await newsWriteErrorMessage(error) };
  }

  if (galleryUrls.length > 0) {
    const { error: imagesError } = await supabase.from("news_images").insert(
      galleryUrls.map((url, index) => ({
        news_id: data.id,
        url,
        sort_order: index,
      })),
    );
    if (imagesError) {
      console.error("Create article images failed:", imagesError);
      return { error: await newsWriteErrorMessage(imagesError) };
    }
  }

  revalidateNewsPaths(parsed.data.slug, data.id);
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

  const galleryUrls = parseGalleryUrls(formData);
  if ("error" in galleryUrls) {
    return { error: await newsWriteErrorMessage(null) };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("news_articles")
    .update({
      ...parsed.data,
      cover_image_url: galleryUrls[0] ?? parsed.data.cover_image_url,
    })
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

export async function uploadNewsImage(
  formData: FormData,
): Promise<NewsImageUploadState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: t("photoType") };
  }
  if (file.size > NEWS_IMAGE_MAX_BYTES) {
    return { error: t("photoSize") };
  }
  const ext = newsImageExtension(file);
  if (!ext) {
    return { error: t("photoType") };
  }

  const articleId = String(formData.get("article_id") ?? "");
  const folder = isUuid(articleId) ? articleId : "new";
  const path = `news/${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from(NEWS_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type || newsImageContentType(ext),
      upsert: false,
    });
  if (error) {
    console.error("Upload news image failed:", error);
    return { error: t("photoUpload") };
  }

  const { data } = supabase.storage.from(NEWS_IMAGE_BUCKET).getPublicUrl(path);
  const url = data.publicUrl;

  if (!isUuid(articleId)) {
    return { url };
  }

  const { data: last } = await supabase
    .from("news_images")
    .select("sort_order")
    .eq("news_id", articleId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (last?.sort_order ?? -1) + 1;
  const { data: inserted, error: insertError } = await supabase
    .from("news_images")
    .insert({
      news_id: articleId,
      url,
      sort_order: sortOrder,
    })
    .select("id")
    .single();
  if (insertError || !inserted) {
    console.error("Insert news image failed:", insertError);
    return { error: t("photoUpload") };
  }

  await syncCoverImageUrl(supabase, articleId);
  await revalidateArticleById(supabase, articleId);
  return { id: inserted.id, url };
}

export async function deleteNewsImage(
  formData: FormData,
): Promise<NewsImageMutationState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("deleteImage"));
  if ("error" in id) {
    return { error: id.error };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_images")
    .delete()
    .eq("id", id.id)
    .select("news_id")
    .maybeSingle();
  if (error) {
    console.error("Delete news image failed:", error);
    return { error: t("deleteImage") };
  }
  if (data?.news_id) {
    await syncCoverImageUrl(supabase, data.news_id);
    await revalidateArticleById(supabase, data.news_id);
  }
  return {};
}

export async function moveNewsImage(
  formData: FormData,
): Promise<NewsImageMutationState> {
  await requireAdmin();
  const t = await getTranslations("admin.errors");
  const id = parseUuid(String(formData.get("id") ?? ""), t("moveImage"));
  if ("error" in id) {
    return { error: id.error };
  }

  const direction = String(formData.get("direction") ?? "");
  if (direction !== "up" && direction !== "down") {
    return { error: t("moveImage") };
  }

  const supabase = createServiceClient();
  const { data: current, error: currentError } = await supabase
    .from("news_images")
    .select("id, news_id, sort_order")
    .eq("id", id.id)
    .maybeSingle();
  if (currentError || !current) {
    console.error("Move news image failed:", currentError);
    return { error: t("moveImage") };
  }

  const { data: siblings, error: listError } = await supabase
    .from("news_images")
    .select("id, sort_order")
    .eq("news_id", current.news_id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (listError || !siblings) {
    console.error("Move news image failed:", listError);
    return { error: t("moveImage") };
  }

  const index = siblings.findIndex((row) => row.id === current.id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= siblings.length) {
    return {};
  }

  const neighbor = siblings[swapIndex];
  const { error: firstError } = await supabase
    .from("news_images")
    .update({ sort_order: neighbor.sort_order })
    .eq("id", current.id);
  const { error: secondError } = await supabase
    .from("news_images")
    .update({ sort_order: current.sort_order })
    .eq("id", neighbor.id);
  if (firstError || secondError) {
    console.error("Move news image failed:", firstError ?? secondError);
    return { error: t("moveImage") };
  }

  await syncCoverImageUrl(supabase, current.news_id);
  await revalidateArticleById(supabase, current.news_id);
  return {};
}
