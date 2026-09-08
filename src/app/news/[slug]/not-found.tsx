import Link from "next/link";

export default function NewsNotFound() {
  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Article not found</h1>
      <p className="mt-3 text-sm text-ink-muted">
        That article is not published, or it is not in the catalog.
      </p>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/news" className="text-ink hover:text-accent">
          Back to news
        </Link>
      </p>
    </section>
  );
}
