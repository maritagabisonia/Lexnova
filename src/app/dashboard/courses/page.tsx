import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard } from "@/components/program-card";
import { requireUser } from "@/lib/require-auth";
import {
  getStudentCourses,
  groupStudentCourses,
} from "@/lib/student-courses";
import type { ProgramSummary } from "@/lib/program-display";

export const metadata: Metadata = {
  title: "My Courses",
};

export default async function DashboardCoursesPage() {
  const { user } = await requireUser();
  const programs = await getStudentCourses(user.id);
  const groups = groupStudentCourses(programs);

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">My Courses</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Courses and trainings you are registered for.
      </p>
      {programs.length === 0 ? (
        <EmptyCourses />
      ) : (
        <div className="mt-10 space-y-12">
          <CourseSection title="Current" programs={groups.current} />
          <CourseSection title="Upcoming" programs={groups.upcoming} />
          <CourseSection title="Completed" programs={groups.completed} />
        </div>
      )}
    </section>
  );
}

function EmptyCourses() {
  return (
    <>
      <p className="mt-8 text-sm text-ink-muted">
        You have not registered for a program yet.
      </p>
      <p className="mt-2">
        <Link
          href="/programs"
          className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
        >
          Browse programs
        </Link>
      </p>
    </>
  );
}

function CourseSection({
  title,
  programs,
}: {
  title: string;
  programs: ProgramSummary[];
}) {
  if (programs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl">{title}</h2>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2">
        {programs.map((program) => (
          <li key={program.id}>
            <ProgramCard program={program} />
          </li>
        ))}
      </ul>
    </section>
  );
}
