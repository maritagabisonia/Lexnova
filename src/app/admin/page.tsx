import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Admin</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Program and user management will appear here.
      </p>
    </section>
  );
}
