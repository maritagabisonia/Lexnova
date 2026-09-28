import { cache } from "react";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { localizedText } from "@/lib/localized-content";
import {
  localizeProgramSummary,
  todayIsoDate,
  type ProgramContentRow,
  type ProgramSummary,
} from "@/lib/program-display";

export type { ProgramSummary } from "@/lib/program-display";
export {
  formatDate,
  formatLabel,
  formatTime,
  isRegistrationDeadlineOpen,
  programFormatFilters,
  programStatusFilters,
  programTypeFilters,
  statusBadgeClass,
  statusLabel,
  translatedFormatLabel,
  translatedStatusLabel,
  translatedTypeLabel,
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

type NewsSummaryRow = {
  id: string;
  title: string | null;
  title_ka?: string | null;
  slug: string;
  short_description: string | null;
  short_description_ka?: string | null;
  published_at: string | null;
  author: string | null;
  cover_image_url: string | null;
};

const newsSummaryFields =
  "id, title, title_ka, slug, short_description, short_description_ka, published_at, author, cover_image_url";

const programFields =
  "id, title, title_ka, slug, short_description, short_description_ka, status, format, type, start_date, created_at";

function localizeNewsSummary(row: NewsSummaryRow, locale: string): NewsSummary {
  return {
    id: row.id,
    title: localizedText(locale, row.title_ka, row.title) ?? "",
    slug: row.slug,
    short_description: localizedText(
      locale,
      row.short_description_ka,
      row.short_description,
    ),
    published_at: row.published_at,
    author: row.author,
    cover_image_url: row.cover_image_url,
  };
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

async function localizedProgramRows(
  query: PromiseLike<{ data: ProgramContentRow[] | null; error: unknown }>,
) {
  const locale = await getLocale();
  const rows = await rowsOrEmpty<ProgramContentRow>(query);
  return rows.map((row) => localizeProgramSummary(row, locale));
}

export async function getFeaturedPrograms() {
  const supabase = await createClient();
  return localizedProgramRows(
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
  return localizedProgramRows(
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

  const locale = await getLocale();
  return (await rowsOrEmpty<NewsSummaryRow>(query)).map((row) =>
    localizeNewsSummary(row, locale),
  );
}

export async function getLatestNews() {
  return getPublishedNews(3);
}

export async function getPrograms() {
  const supabase = await createClient();
  return localizedProgramRows(
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
  "id, type, title, title_ka, slug, short_description, short_description_ka, full_description, full_description_ka, target_audience, target_audience_ka, objectives, objectives_ka, learning_outcomes, learning_outcomes_ka, duration_text, start_date, end_date, registration_deadline, format, location, lecturer_id, max_participants, status";

export const getProgramBySlug = cache(async function getProgramBySlug(
  slug: string,
): Promise<ProgramDetail | null> {
  try {
    const locale = await getLocale();
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
        .select("full_name, photo_url, bio, bio_ka, title")
        .eq("id", program.lecturer_id)
        .maybeSingle(),
      supabase
        .from("program_sessions")
        .select("id, session_date, start_time, end_time, location, location_ka, format")
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

    const sessions = rowsOrEmptySync(
      sessionsResult.data,
      sessionsResult.error,
    ).map((session) => ({
      id: session.id,
      session_date: session.session_date,
      start_time: session.start_time,
      end_time: session.end_time,
      location: localizedText(locale, session.location_ka, session.location),
      format: session.format,
    }));

    const lecturer = lecturerResult.data
      ? {
          full_name: lecturerResult.data.full_name,
          photo_url: lecturerResult.data.photo_url,
          title: lecturerResult.data.title,
          bio: localizedText(
            locale,
            lecturerResult.data.bio_ka,
            lecturerResult.data.bio,
          ),
        }
      : null;

    return {
      id: program.id,
      type: program.type,
      title: localizedText(locale, program.title_ka, program.title) ?? "",
      slug: program.slug,
      short_description: localizedText(
        locale,
        program.short_description_ka,
        program.short_description,
      ),
      full_description: localizedText(
        locale,
        program.full_description_ka,
        program.full_description,
      ),
      target_audience: localizedText(
        locale,
        program.target_audience_ka,
        program.target_audience,
      ),
      objectives: localizedText(
        locale,
        program.objectives_ka,
        program.objectives,
      ),
      learning_outcomes: localizedText(
        locale,
        program.learning_outcomes_ka,
        program.learning_outcomes,
      ),
      duration_text: program.duration_text,
      start_date: program.start_date,
      end_date: program.end_date,
      registration_deadline: program.registration_deadline,
      format: program.format,
      location: program.location,
      max_participants: program.max_participants,
      status: program.status,
      lecturer,
      sessions,
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
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select(
        "id, title, title_ka, slug, short_description, short_description_ka, content, content_ka, author, published_at, cover_image_url, related_program_id",
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
        relatedProgram = localizeProgramSummary(program, locale);
      }
    }

    return {
      id: data.id,
      title: localizedText(locale, data.title_ka, data.title) ?? "",
      slug: data.slug,
      short_description: localizedText(
        locale,
        data.short_description_ka,
        data.short_description,
      ),
      content: localizedText(locale, data.content_ka, data.content),
      author: data.author,
      published_at: data.published_at,
      cover_image_url: data.cover_image_url,
      relatedProgram,
    };
  } catch {
    return null;
  }
});
