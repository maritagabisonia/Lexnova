import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not in this site.",
};

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-sm text-ink-muted">
        That page is not in this site.
      </p>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/" className="text-ink hover:text-accent">
          Back to home
        </Link>
      </p>
    </section>
  );
}
