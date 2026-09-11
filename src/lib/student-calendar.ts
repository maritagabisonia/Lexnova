import { cache } from "react";
import { formatLabel, todayIsoDate } from "@/lib/program-display";
import { getStudentCourses } from "@/lib/student-courses";
import { createClient } from "@/lib/supabase/server";

export type CalendarSession = {
  id: string;
  programId: string;
  programTitle: string;
  programSlug: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string | null;
  format: string;
};

export type CalendarDateGroup = {
  date: string;
  sessions: CalendarSession[];
};

export function sessionPlaceLine(session: Pick<CalendarSession, "format" | "location">) {
  const format = formatLabel(session.format);
  if (session.format === "online") {
    return session.location?.trim() || format;
  }
  if (session.location?.trim()) {
    return `${format} · ${session.location.trim()}`;
  }
  return format;
}

export function groupSessionsByDate(sessions: CalendarSession[]): CalendarDateGroup[] {
  const groups: CalendarDateGroup[] = [];

  for (const session of sessions) {
    const last = groups[groups.length - 1];
    if (last && last.date === session.sessionDate) {
      last.sessions.push(session);
    } else {
      groups.push({ date: session.sessionDate, sessions: [session] });
    }
  }

  return groups;
}

export const getStudentCalendarSessions = cache(async function getStudentCalendarSessions(
  studentId: string,
  { fromDate = todayIsoDate() }: { fromDate?: string | null } = {},
): Promise<CalendarSession[]> {
  const programs = await getStudentCourses(studentId);
  if (programs.length === 0) {
    return [];
  }

  const programById = new Map(programs.map((program) => [program.id, program]));

  try {
    const supabase = await createClient();
    let query = supabase
      .from("program_sessions")
      .select("id, program_id, session_date, start_time, end_time, location, format")
      .in("program_id", programs.map((program) => program.id))
      .order("session_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (fromDate) {
      query = query.gte("session_date", fromDate);
    }

    const { data, error } = await query;
    if (error || !data) {
      if (error) {
        console.error("Student calendar query failed:", error);
      }
      return [];
    }

    const sessions: CalendarSession[] = [];
    for (const row of data) {
      const program = programById.get(row.program_id);
      if (!program) {
        continue;
      }
      sessions.push({
        id: row.id,
        programId: program.id,
        programTitle: program.title,
        programSlug: program.slug,
        sessionDate: row.session_date,
        startTime: row.start_time,
        endTime: row.end_time,
        location: row.location,
        format: row.format,
      });
    }
    return sessions;
  } catch (error) {
    console.error("Student calendar query failed:", error);
    return [];
  }
});
