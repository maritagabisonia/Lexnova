import { cache } from "react";
import { todayIsoDate, type ProgramSummary } from "@/lib/program-display";
import { createClient } from "@/lib/supabase/server";

const programFields =
  "id, title, slug, short_description, status, format, type, start_date, created_at";

export type CourseGroups = {
  current: ProgramSummary[];
  upcoming: ProgramSummary[];
  completed: ProgramSummary[];
};

function byStartAsc(a: ProgramSummary, b: ProgramSummary) {
  return (a.start_date ?? "9999").localeCompare(b.start_date ?? "9999");
}

function byStartDesc(a: ProgramSummary, b: ProgramSummary) {
  return (b.start_date ?? "").localeCompare(a.start_date ?? "");
}

export function groupStudentCourses(
  programs: ProgramSummary[],
  today = todayIsoDate(),
): CourseGroups {
  const current: ProgramSummary[] = [];
  const upcoming: ProgramSummary[] = [];
  const completed: ProgramSummary[] = [];

  for (const program of programs) {
    if (program.status === "completed") {
      completed.push(program);
    } else if (program.status === "in_progress") {
      current.push(program);
    } else if (program.start_date && program.start_date > today) {
      upcoming.push(program);
    } else if (program.start_date && program.start_date <= today) {
      current.push(program);
    } else {
      upcoming.push(program);
    }
  }

  current.sort(byStartAsc);
  upcoming.sort(byStartAsc);
  completed.sort(byStartDesc);

  return { current, upcoming, completed };
}

function asProgram(
  value: ProgramSummary | ProgramSummary[] | null | undefined,
): ProgramSummary | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export const getStudentCourses = cache(async function getStudentCourses(
  studentId: string,
): Promise<ProgramSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("registrations")
      .select(`id, programs(${programFields})`)
      .eq("student_id", studentId)
      .eq("status", "confirmed");

    if (error || !data) {
      if (error) {
        console.error("Student courses query failed:", error);
      }
      return [];
    }

    const programs: ProgramSummary[] = [];
    for (const row of data) {
      const program = asProgram(
        row.programs as ProgramSummary | ProgramSummary[] | null,
      );
      if (program) {
        programs.push(program);
      }
    }
    return programs;
  } catch (error) {
    console.error("Student courses query failed:", error);
    return [];
  }
});
