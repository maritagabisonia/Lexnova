import { cache } from "react";
import { formatDate, todayIsoDate } from "@/lib/program-display";
import { createClient } from "@/lib/supabase/server";

const ACTIVE_PROGRAM_STATUSES = [
  "registration_open",
  "coming_soon",
  "fully_booked",
  "in_progress",
] as const;

export type AdminOverviewStats = {
  activePrograms: number;
  programsStartingSoon: number;
  registeredStudents: number;
};

export type AdminRecentRegistration = {
  id: string;
  studentName: string;
  programTitle: string;
  programSlug: string | null;
  registeredOn: string | null;
};

function addDaysIso(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export const getAdminOverview = cache(async function getAdminOverview(): Promise<{
  stats: AdminOverviewStats;
  recent: AdminRecentRegistration[];
}> {
  const empty = {
    stats: {
      activePrograms: 0,
      programsStartingSoon: 0,
      registeredStudents: 0,
    },
    recent: [] as AdminRecentRegistration[],
  };

  try {
    const supabase = await createClient();
    const today = todayIsoDate();
    const horizon = addDaysIso(today, 30);

    const [activeResult, startingResult, studentsResult, recentResult] =
      await Promise.all([
        supabase
          .from("programs")
          .select("id", { count: "exact", head: true })
          .in("status", [...ACTIVE_PROGRAM_STATUSES]),
        supabase
          .from("programs")
          .select("id", { count: "exact", head: true })
          .gte("start_date", today)
          .lte("start_date", horizon),
        supabase
          .from("registrations")
          .select("student_id")
          .eq("status", "confirmed"),
        supabase
          .from("registrations")
          .select(
            "id, registered_at, profiles(full_name), programs(title, slug)",
          )
          .eq("status", "confirmed")
          .order("registered_at", { ascending: false })
          .limit(10),
      ]);

    if (activeResult.error) {
      console.error("Admin active programs count failed:", activeResult.error);
    }
    if (startingResult.error) {
      console.error("Admin starting-soon count failed:", startingResult.error);
    }
    if (studentsResult.error) {
      console.error("Admin registered students query failed:", studentsResult.error);
    }
    if (recentResult.error) {
      console.error("Admin recent registrations query failed:", recentResult.error);
    }

    const uniqueStudents = new Set(
      (studentsResult.data ?? []).map((row) => row.student_id),
    );

    const recent: AdminRecentRegistration[] = [];
    for (const row of recentResult.data ?? []) {
      const profile = asOne(
        row.profiles as { full_name: string | null } | { full_name: string | null }[] | null,
      );
      const program = asOne(
        row.programs as
          | { title: string | null; slug: string | null }
          | { title: string | null; slug: string | null }[]
          | null,
      );
      recent.push({
        id: row.id,
        studentName: profile?.full_name?.trim() || "Student",
        programTitle: program?.title?.trim() || "Program",
        programSlug: program?.slug ?? null,
        registeredOn: formatDate(row.registered_at?.slice(0, 10) ?? null),
      });
    }

    return {
      stats: {
        activePrograms: activeResult.count ?? 0,
        programsStartingSoon: startingResult.count ?? 0,
        registeredStudents: uniqueStudents.size,
      },
      recent,
    };
  } catch (error) {
    console.error("Admin overview query failed:", error);
    return empty;
  }
});
