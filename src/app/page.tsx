import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard } from "@/components/program-card";
import {
  formatDate,
  formatLabel,
  getFeaturedPrograms,
  getLatestNews,
  getUpcomingPrograms,
} from "@/lib/catalog";
import { publicPages } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.home;
}

export default async function Home() {
  const [featured, upcoming, news] = await Promise.all([
    getFeaturedPrograms(),
    getUpcomingPrograms(),
    getLatestNews(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-sm tracking-wide text-accent">{site.name}</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl">
          Legal education for a more informed public.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          LexNova offers courses and training for lawyers, civic advocates, and
          anyone who needs a clearer map of the law — taught by practitioners,
          and grounded in professional judgment rather than product demos.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/programs"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-5 text-sm text-paper transition-colors hover:bg-ink-muted"
          >
            Explore Programs
          </Link>
          <Link
            href="/programs?type=training"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-ink px-5 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            View Training
          </Link>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl">Featured Programs</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Programs currently open for registration.
              </p>
            </div>
            <Link
              href="/programs"
              className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
            >
              All programs
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {featured.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink-muted">
              No programs are open for registration right now.{" "}
              <Link href="/programs" className="text-ink hover:text-accent">
                Browse all programs
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl">Upcoming</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Programs with a start date still ahead.
        </p>
        {upcoming.length > 0 ? (
          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {upcoming.map((program) => (
              <li
                key={program.id}
                className="flex flex-col gap-2 py-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-3"
              >
                <div>
                  <Link
                    href={`/programs/${program.slug}`}
                    className="font-serif text-lg hover:text-accent"
                  >
                    {program.title}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatLabel(program.format)}
                    {program.start_date
                      ? ` · Starts ${formatDate(program.start_date)}`
                      : null}
                  </p>
                </div>
                <Link
                  href={`/programs/${program.slug}`}
                  className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
                >
                  Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-sm text-ink-muted">
            No upcoming programs are scheduled yet.
          </p>
        )}
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <h2 className="text-3xl">Latest News</h2>
            <Link
              href="/news"
              className="inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
            >
              All news
            </Link>
          </div>
          {news.length > 0 ? (
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {news.map((article) => (
                <article key={article.id}>
                  <p className="text-xs tracking-wide text-ink-muted">
                    {article.published_at
                      ? formatDate(article.published_at.slice(0, 10))
                      : null}
                  </p>
                  <h3 className="mt-2 text-xl">
                    <Link
                      href={`/news/${article.slug}`}
                      className="hover:text-accent"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  {article.short_description ? (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {article.short_description}
                    </p>
                  ) : null}
                  <Link
                    href={`/news/${article.slug}`}
                    className="mt-4 inline-flex min-h-11 items-center text-sm text-ink hover:text-accent"
                  >
                    Read article
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink-muted">
              No news has been published yet.
            </p>
          )}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:gap-8">
          <div>
            <h2 className="text-2xl text-paper">Get in touch</h2>
            <p className="mt-3 flex flex-col gap-2 text-sm text-paper/80 sm:block">
              <a className="inline-flex min-h-11 items-center hover:text-accent sm:min-h-0" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <span className="mx-3 hidden text-paper/40 sm:inline">·</span>
              <a className="inline-flex min-h-11 items-center hover:text-accent sm:min-h-0" href={`tel:${site.phone}`}>
                {site.phone}
              </a>
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-accent px-5 text-sm text-ink transition-colors hover:bg-paper"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
