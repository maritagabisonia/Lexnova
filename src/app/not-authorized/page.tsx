import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Not authorized",
};

export default function NotAuthorizedPage() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Not authorized</h1>
      <p className="mt-3 text-sm text-ink-muted">
        You do not have permission to view that page.
      </p>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/" className="text-ink hover:text-accent">
          Back to home
        </Link>
      </p>
    </section>
  );
}
