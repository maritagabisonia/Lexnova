import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Dashboard</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Your registrations and account will appear here.
      </p>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/dashboard/profile" className="text-ink hover:text-accent">
          Edit your profile
        </Link>
      </p>
    </section>
  );
}
