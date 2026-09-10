import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">Calendar</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        Upcoming sessions for the programs you are registered for.
      </p>
      <p className="mt-8 text-sm text-ink-muted">
        No sessions to show yet.
      </p>
      <p className="mt-2">
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
        >
          View your courses
        </Link>
      </p>
    </section>
  );
}
