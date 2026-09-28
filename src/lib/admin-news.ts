import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { localizedText } from "@/lib/localized-content";
import {
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
      .select("id, title, title_ka, slug, published, published_at, created_at")
      .order("created_at", { ascending: false });
    if (error || !data) {
      if (error) {
        console.error("Admin news list failed:", error);
      }
      return [];
    }
    return data.map((row) => ({
      id: row.id,
      title: localizedText("en", row.title_ka, row.title) ?? "",
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
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("programs")
        .select("id, title, title_ka")
        .order("title", { ascending: true });
      if (error || !data) {
        if (error) {
          console.error("Admin related programs failed:", error);
        }
        return [];
      }
      return data.map((row) => ({
        id: row.id,
        title: localizedText("en", row.title_ka, row.title) ?? "",
      }));
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
        "id, title, title_ka, slug, cover_image_url, short_description, short_description_ka, content, content_ka, author, related_program_id, published, published_at, created_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return null;
    }
    return {
      id: data.id,
      title: data.title ?? "",
      title_ka: data.title_ka ?? "",
      slug: data.slug ?? "",
      cover_image_url: data.cover_image_url ?? "",
      short_description: data.short_description ?? "",
      short_description_ka: data.short_description_ka ?? "",
      content: data.content ?? "",
      content_ka: data.content_ka ?? "",
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
