import { createClient } from "@/lib/supabase/server";

export type ProgramSummary = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  status: string;
  format: string;
  type: string;
  start_date: string | null;
  created_at: string;
};

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

export function statusLabel(status: string) {
  const labels: Record<string, string> = {
    registration_open: "Registration open",
    coming_soon: "Coming soon",
    fully_booked: "Fully booked",
    in_progress: "In progress",
    completed: "Completed",
    archived: "Archived",
  };
  return labels[status] ?? status.replaceAll("_", " ");
}

export function formatLabel(format: string) {
  const labels: Record<string, string> = {
    online: "Online",
    in_person: "In person",
    hybrid: "Hybrid",
  };
  return labels[format] ?? format.replaceAll("_", " ");
}

export function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

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

export async function getPrograms(type?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("programs")
    .select(programFields)
    .neq("status", "archived")
    .order("start_date", { ascending: true });

  if (type === "course" || type === "training") {
    query = query.eq("type", type);
  }

  return rowsOrEmpty<ProgramSummary>(query);
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
