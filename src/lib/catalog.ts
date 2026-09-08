import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { ProgramSummary } from "@/lib/program-display";

export type { ProgramSummary } from "@/lib/program-display";
export {
  formatDate,
  formatLabel,
  formatTime,
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
  cover_image_url: string | null;
};

const newsSummaryFields =
  "id, title, slug, short_description, published_at, author, cover_image_url";

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

export async function getPublishedNews(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("news_articles")
    .select(newsSummaryFields)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (limit) {
    query = query.limit(limit);
  }

  return rowsOrEmpty<NewsSummary>(query);
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

export type LecturerSummary = {
  full_name: string;
  photo_url: string | null;
  bio: string | null;
  title: string | null;
};

export type ProgramSession = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  format: string;
};

export type ProgramDetail = {
  id: string;
  type: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  target_audience: string | null;
  objectives: string | null;
  learning_outcomes: string | null;
  duration_text: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  format: string;
  location: string | null;
  max_participants: number | null;
  status: string;
  lecturer: LecturerSummary | null;
  sessions: ProgramSession[];
  registeredCount: number | null;
};

const programDetailFields =
  "id, type, title, slug, short_description, full_description, target_audience, objectives, learning_outcomes, duration_text, start_date, end_date, registration_deadline, format, location, lecturer_id, max_participants, status";

export const getProgramBySlug = cache(async function getProgramBySlug(
  slug: string,
): Promise<ProgramDetail | null> {
  try {
    const supabase = await createClient();
    const { data: program, error } = await supabase
      .from("programs")
      .select(programDetailFields)
      .eq("slug", slug)
      .maybeSingle();

    if (error || !program) {
      return null;
    }

    const [lecturerResult, sessionsResult, countResult] = await Promise.all([
      supabase
        .from("lecturers")
        .select("full_name, photo_url, bio, title")
        .eq("id", program.lecturer_id)
        .maybeSingle(),
      supabase
        .from("program_sessions")
        .select("id, session_date, start_time, end_time, location, format")
        .eq("program_id", program.id)
        .order("session_date", { ascending: true })
        .order("start_time", { ascending: true }),
      program.max_participants
        ? supabase.rpc("confirmed_registration_count", {
            p_program_id: program.id,
          })
        : Promise.resolve({ data: null, error: null }),
    ]);

    let registeredCount: number | null = null;
    if (program.max_participants) {
      if (countResult.error || countResult.data == null) {
        registeredCount = null;
      } else {
        registeredCount = Number(countResult.data);
      }
    }

    return {
      id: program.id,
      type: program.type,
      title: program.title,
      slug: program.slug,
      short_description: program.short_description,
      full_description: program.full_description,
      target_audience: program.target_audience,
      objectives: program.objectives,
      learning_outcomes: program.learning_outcomes,
      duration_text: program.duration_text,
      start_date: program.start_date,
      end_date: program.end_date,
      registration_deadline: program.registration_deadline,
      format: program.format,
      location: program.location,
      max_participants: program.max_participants,
      status: program.status,
      lecturer: lecturerResult.data ?? null,
      sessions: rowsOrEmptySync(sessionsResult.data, sessionsResult.error),
      registeredCount,
    };
  } catch {
    return null;
  }
});

export async function getProgramSitemapEntries() {
  const supabase = await createClient();
  return rowsOrEmpty<{ slug: string; updated_at: string }>(
    supabase
      .from("programs")
      .select("slug, updated_at")
      .order("updated_at", { ascending: false }),
  );
}

export async function getPublishedNewsSitemapEntries() {
  const supabase = await createClient();
  return rowsOrEmpty<{ slug: string; published_at: string | null }>(
    supabase
      .from("news_articles")
      .select("slug, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false }),
  );
}

function rowsOrEmptySync<T>(data: T[] | null | undefined, error: unknown) {
  if (error || !data) {
    if (error) {
      console.error("Catalog query failed:", error);
    }
    return [] as T[];
  }
  return data;
}

export type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  content: string | null;
  author: string | null;
  published_at: string | null;
  cover_image_url: string | null;
  relatedProgram: ProgramSummary | null;
};

export const getNewsBySlug = cache(async function getNewsBySlug(
  slug: string,
): Promise<NewsArticle | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select(
        "id, title, slug, short_description, content, author, published_at, cover_image_url, related_program_id",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    let relatedProgram: ProgramSummary | null = null;
    if (data.related_program_id) {
      const { data: program, error: programError } = await supabase
        .from("programs")
        .select(programFields)
        .eq("id", data.related_program_id)
        .maybeSingle();

      if (!programError && program) {
        relatedProgram = program;
      }
    }

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      short_description: data.short_description,
      content: data.content,
      author: data.author,
      published_at: data.published_at,
      cover_image_url: data.cover_image_url,
      relatedProgram,
    };
  } catch {
    return null;
  }
});
