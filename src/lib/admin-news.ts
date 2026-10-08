import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { formatAdminDateTime } from "@/lib/admin-format";
import {
  mapRelatedProgramOptions,
  toDateTimeLocal,
  type NewsFormValues,
  type RelatedProgramOption,
} from "@/lib/news-fields";
import { createClient } from "@/lib/supabase/server";

export type { NewsFormValues, RelatedProgramOption } from "@/lib/news-fields";
export { emptyNewsFormValues } from "@/lib/news-fields";

export type AdminNewsRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedLabel: string;
  publishedAt: string | null;
};

function formatTimestamp(value: string | null, locale: string) {
  if (!value) {
    return null;
  }
  return formatAdminDateTime(value, locale);
}

export const getAdminNews = cache(async function getAdminNews(): Promise<
  AdminNewsRow[]
> {
  try {
    const locale = await getLocale();
    const t = await getTranslations("admin");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("id, title, slug, published, published_at, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) {
      if (error) {
        console.error("Admin news list failed:", error);
      }
      return [];
    }
    return data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      published: row.published,
      publishedLabel: row.published ? t("published") : t("draft"),
      publishedAt: formatTimestamp(row.published_at, locale),
    }));
  } catch (error) {
    console.error("Admin news list failed:", error);
    return [];
  }
});

export const getAdminRelatedPrograms = cache(
  async function getAdminRelatedPrograms(): Promise<RelatedProgramOption[]> {
    try {
      const locale = await getLocale();
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("programs")
        .select("id, title, title_ka")
        .order("created_at", { ascending: false });
      if (error || !data) {
        if (error) {
          console.error("Admin related programs failed:", error);
        }
        return [];
      }
      return mapRelatedProgramOptions(data, locale);
    } catch (error) {
      console.error("Admin related programs failed:", error);
      return [];
    }
  },
);

export const getAdminArticle = cache(async function getAdminArticle(
  id: string,
): Promise<NewsFormValues | null> {
  try {
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select(
        "id, title, slug, cover_image_url, short_description, content, author, related_program_id, published, published_at, created_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return null;
    }
    const { data: imageRows, error: imagesError } = await supabase
      .from("news_images")
      .select("id, url, sort_order")
      .eq("news_id", id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (imagesError) {
      console.error("Admin news images failed:", imagesError);
    }
    const images =
      imageRows && imageRows.length > 0
        ? imageRows.map((row) => ({
            id: row.id,
            url: row.url,
            sort_order: row.sort_order,
          }))
        : data.cover_image_url
          ? [{ url: data.cover_image_url, sort_order: 0 }]
          : [];
    return {
      id: data.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      cover_image_url: data.cover_image_url ?? images[0]?.url ?? "",
      images,
      short_description: data.short_description ?? "",
      content: data.content ?? "",
      author: data.author ?? "",
      related_program_id: data.related_program_id ?? "",
      published: Boolean(data.published),
      published_at: toDateTimeLocal(data.published_at),
      created_at: formatTimestamp(data.created_at ?? null, locale),
    };
  } catch {
    return null;
  }
});
