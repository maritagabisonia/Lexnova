import { cache } from "react";
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

function formatTimestamp(value: string | null) {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

export const getAdminNews = cache(async function getAdminNews(): Promise<
  AdminNewsRow[]
> {
  try {
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
      publishedLabel: row.published ? "Published" : "Draft",
      publishedAt: formatTimestamp(row.published_at),
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
        .select("id, title")
        .order("title", { ascending: true });
      if (error || !data) {
        if (error) {
          console.error("Admin related programs failed:", error);
        }
        return [];
      }
      return data.map((row) => ({ id: row.id, title: row.title }));
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
    return {
      id: data.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      cover_image_url: data.cover_image_url ?? "",
      short_description: data.short_description ?? "",
      content: data.content ?? "",
      author: data.author ?? "",
      related_program_id: data.related_program_id ?? "",
      published: Boolean(data.published),
      published_at: toDateTimeLocal(data.published_at),
      created_at: formatTimestamp(data.created_at ?? null),
    };
  } catch {
    return null;
  }
});
