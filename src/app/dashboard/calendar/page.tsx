import type { Metadata } from "next";
import Link from "next/link";
import {
  formatCalendarDate,
  formatTime,
} from "@/lib/program-display";
import { requireUser } from "@/lib/require-auth";
import {
  getStudentCalendarSessions,
  groupSessionsByDate,
  sessionPlaceLine,
  type CalendarSession,
} from "@/lib/student-calendar";
import { getStudentCourses } from "@/lib/student-courses";

export const metadata: Metadata = {
  title: "Calendar",
};

export default async function CalendarPage() {
  const { user } = await requireUser();
  const [programs, sessions] = await Promise.all([
    getStudentCourses(user.id),
    getStudentCalendarSessions(user.id),
  ]);
  const groups = groupSessionsByDate(sessions);

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">Calendar</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Upcoming sessions for the programs you are registered for.
      </p>
      {groups.length === 0 ? (
        <EmptyCalendar hasCourses={programs.length > 0} />
      ) : (
        <ol className="mt-10 space-y-10">
          {groups.map((group) => (
            <li key={group.date}>
              <h2 className="text-xl">
                <time dateTime={group.date}>
                  {formatCalendarDate(group.date)}
                </time>
              </h2>
              <ul className="mt-4 space-y-4">
                {group.sessions.map((session) => (
                  <CalendarEntry key={session.id} session={session} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function CalendarEntry({ session }: { session: CalendarSession }) {
  const dateLabel = formatCalendarDate(session.sessionDate);
  const timeLabel = formatTime(session.startTime);
  const place = sessionPlaceLine(session);

  return (
    <li className="border-l-4 border-ink/15 pl-4">
      <p className="text-base text-ink">
        <time dateTime={session.sessionDate}>{dateLabel}</time>
        {" — "}
        <Link
          href={`/programs/${session.programSlug}`}
          className="hover:text-accent"
        >
          {session.programTitle}
        </Link>
        {" — "}
        {timeLabel}
      </p>
      {place ? (
        <p className="mt-1 text-sm text-ink-muted">{place}</p>
      ) : null}
    </li>
  );
}

function EmptyCalendar({ hasCourses }: { hasCourses: boolean }) {
  return (
    <>
      <p className="mt-8 text-sm text-ink-muted">
        {hasCourses
          ? "No upcoming sessions to show."
          : "No sessions to show yet."}
      </p>
      <p className="mt-2">
        <Link
          href={hasCourses ? "/dashboard/courses" : "/programs"}
          className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
        >
          {hasCourses ? "View your courses" : "Browse programs"}
        </Link>
      </p>
    </>
  );
}
