import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

/**
 * Renders an HTML comment in the page source so placeholder copy is easy to
 * find in View Source as well as in this file.
 */
function PlaceholderComment({ name }: { name: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!-- PLACEHOLDER: ${name} — replace this copy -->`,
      }}
    />
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-sm tracking-wide text-accent">About</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl">
          A legal education center, in public.
        </h1>
        {/* PLACEHOLDER: Intro */}
        <PlaceholderComment name="Intro" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          LexNova is a center for legal education. We teach lawyers, civic
          advocates, and members of the public who need a clearer map of the
          law — in courses, short trainings, and open lectures.
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl">Mission</h2>
          {/* PLACEHOLDER: Mission */}
          <PlaceholderComment name="Mission" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            Our mission is to make sound legal education available beyond the
            usual professional circuits: careful teaching of doctrine, procedure,
            and professional ethics, offered to people who will use that
            knowledge in practice, in civic work, or in ordinary encounters
            with the state.
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl">Vision</h2>
          {/* PLACEHOLDER: Vision */}
          <PlaceholderComment name="Vision" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            We want a public that can read a statute, follow a hearing, and
            ask a precise question of a lawyer — and a profession that treats
            teaching as part of its duty, not as a sideline. LexNova should be
            a place where those two audiences meet.
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl">Objectives</h2>
          {/* PLACEHOLDER: Objectives */}
          <PlaceholderComment name="Objectives" />
          <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-base leading-relaxed text-ink-muted">
            <li>
              Offer a small, serious catalog of courses and trainings each year,
              taught by practitioners who still do the work they describe.
            </li>
            <li>
              Keep public lectures and written explainers in the open, so legal
              literacy is not reserved for paying cohorts.
            </li>
            <li>
              Hold a clear line on professional judgment: tools and methods are
              in scope; shortcuts that replace that judgment are not.
            </li>
            <li>
              Build a teaching bench — lawyers, researchers, and civic
              educators — who can return, year after year, to the same students.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl">Main Areas of Activity</h2>
          {/* PLACEHOLDER: Main Areas of Activity */}
          <PlaceholderComment name="Main Areas of Activity" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">Courses</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Multi-week programs on core subjects — administrative law, legal
                technology, procedure — for people who want more than a single
                afternoon.
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">Professional training</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Short, intensive sessions for practicing lawyers and staff:
                ethics, investigations, and the use of new tools without
                abandoning professional duties.
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">Public legal literacy</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Open lectures, explainers, and news notes for journalists,
                advocates, and anyone who has to deal with a public office and
                wants to understand the process first.
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">Teaching and curriculum</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Design of syllabi, case materials, and in-house workshops for
                organizations that need a shared legal language rather than a
                one-off speaker.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl">Team</h2>
          {/* PLACEHOLDER: Team */}
          <PlaceholderComment name="Team" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((person) => (
              <article
                key={person.name}
                className="flex h-full flex-col border border-ink/10 bg-paper p-5"
              >
                {/* PLACEHOLDER: Team photo */}
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center bg-paper-muted text-2xl font-serif tracking-wide text-ink-muted"
                  aria-hidden="true"
                >
                  {person.initials}
                </div>
                <h3 className="mt-4 text-xl">{person.name}</h3>
                <p className="mt-1 text-sm tracking-wide text-accent">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {person.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* PLACEHOLDER: Team members — replace name, role, initials, and bio. */
const team = [
  {
    name: "Amelia Hart",
    role: "Director",
    initials: "AH",
    bio: "Amelia founded LexNova after a decade in public-interest litigation and continuing legal education. She teaches procedure and the ethics of advice.",
  },
  {
    name: "Julian Reeve",
    role: "Head of Programs",
    initials: "JR",
    bio: "Julian designs the course calendar and works with lecturers on syllabus and assessment. He previously ran professional training at a regional bar association.",
  },
  {
    name: "Noor El-Sayed",
    role: "Training Lead",
    initials: "NE",
    bio: "Noor leads short trainings for practicing lawyers and staff, with a focus on investigations, administrative process, and legal technology in daily work.",
  },
];
