import type { Metadata } from "next";

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
    </section>
  );
}
