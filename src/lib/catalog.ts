import { createClient } from "@/lib/supabase/server";
import type { ProgramSummary } from "@/lib/program-display";

export type { ProgramSummary } from "@/lib/program-display";
export {
  formatDate,
  formatLabel,
  programFormatFilters,
  programStatusFilters,
  programTypeFilters,
  statusBadgeClass,
  statusLabel,
  typeBadgeClass,
  typeLabel,
} from "@/lib/program-display";

export type NewsSummary = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  published_at: string | null;
  author: string | null;
};

const programFields =
  "id, title, slug, short_description, status, format, type, start_date, created_at";

async function rowsOrEmpty<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>) {
  try {
    const { data, error } = await query;
    if (error || !data) {
      if (error) {
        console.error("Catalog query failed:", error);
      }
      return [] as T[];
    }
    return data;
  } catch (error) {
    console.error("Catalog query failed:", error);
    return [] as T[];
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export async function getFeaturedPrograms() {
  const supabase = await createClient();
  return rowsOrEmpty<ProgramSummary>(
    supabase
      .from("programs")
      .select(programFields)
      .eq("status", "registration_open")
      .order("created_at", { ascending: false })
      .limit(3),
  );
}

export async function getUpcomingPrograms() {
  const supabase = await createClient();
  return rowsOrEmpty<ProgramSummary>(
    supabase
      .from("programs")
      .select(programFields)
      .gte("start_date", todayIsoDate())
      .or(
        "status.eq.registration_open,status.eq.coming_soon,status.eq.in_progress,status.eq.fully_booked",
      )
      .order("start_date", { ascending: true })
      .limit(5),
  );
}

export async function getPublishedNews(limit = 20) {
  const supabase = await createClient();
  return rowsOrEmpty<NewsSummary>(
    supabase
      .from("news_articles")
      .select("id, title, slug, short_description, published_at, author")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(limit),
  );
}

export async function getLatestNews() {
  return getPublishedNews(3);
}

export async function getPrograms() {
  const supabase = await createClient();
  return rowsOrEmpty<ProgramSummary>(
    supabase
      .from("programs")
      .select(programFields)
      .neq("status", "archived")
      .order("start_date", { ascending: true, nullsFirst: false }),
  );
}

export async function getProgramBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programs")
      .select(
        "id, title, slug, short_description, full_description, status, format, type, start_date, end_date, duration_text, location",
      )
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("id, title, slug, short_description, content, author, published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
