import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  formatLabel,
  formatTime,
  getProgramBySlug,
  isRegistrationDeadlineOpen,
  statusBadgeClass,
  statusLabel,
  typeBadgeClass,
  typeLabel,
  type ProgramDetail,
  type ProgramSession,
} from "@/lib/catalog";
import { descriptionFromFields } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { ProgramRegisterForm } from "./register-form";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) {
    return { title: "Program" };
  }

  return {
    title: program.title,
    description:
      descriptionFromFields(program.short_description, program.full_description) ??
      `A LexNova ${typeLabel(program.type).toLowerCase()}.`,
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyRegistered = false;
  if (user) {
    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("program_id", program.id)
      .eq("student_id", user.id)
      .maybeSingle();
    alreadyRegistered = Boolean(existing);
  }

  const deadlineOpen = isRegistrationDeadlineOpen(program.registration_deadline);
  const fullyBooked =
    program.max_participants != null &&
    program.registeredCount != null &&
    program.registeredCount >= program.max_participants;
  const registrationOpen = program.status === "registration_open" && deadlineOpen;
  const showLocation = program.format !== "online" && Boolean(program.location);
  const dateLine = programDateLine(program);
  const capacityLine = programCapacityLine(program);

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <p className="text-sm text-ink-muted">
        <Link href="/programs" className="inline-flex min-h-11 items-center hover:text-accent">
          Programs
        </Link>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${typeBadgeClass(program.type)}`}
        >
          {typeLabel(program.type)}
        </span>
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${statusBadgeClass(program.status)}`}
        >
          {statusLabel(program.status)}
        </span>
      </div>

      <h1 className="mt-4 text-3xl sm:text-5xl">{program.title}</h1>

      <dl className="mt-6 space-y-2 text-sm text-ink-muted">
        <Fact label="Format" value={formatLabel(program.format)} />
        {dateLine ? <Fact label="Dates" value={dateLine} /> : null}
        {program.duration_text ? (
          <Fact label="Duration" value={program.duration_text} />
        ) : null}
        {program.registration_deadline ? (
          <Fact
            label="Registration deadline"
            value={formatDate(program.registration_deadline) ?? undefined}
          />
        ) : null}
        {showLocation ? <Fact label="Location" value={program.location ?? undefined} /> : null}
        {capacityLine ? <Fact label="Places" value={capacityLine} /> : null}
      </dl>

      <div className="mt-8">
        <RegisterCta
          slug={program.slug}
          status={program.status}
          alreadyRegistered={alreadyRegistered}
          fullyBooked={fullyBooked}
          registrationOpen={registrationOpen}
        />
      </div>

      <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-ink">
        {program.full_description ||
          program.short_description ||
          "Details for this program will be published soon."}
      </div>

      {program.target_audience ? (
        <section className="mt-12">
          <h2 className="text-2xl">Target audience</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.target_audience}
          </p>
        </section>
      ) : null}

      {program.objectives ? (
        <section className="mt-12">
          <h2 className="text-2xl">Objectives</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.objectives}
          </p>
        </section>
      ) : null}

      {program.learning_outcomes ? (
        <section className="mt-12">
          <h2 className="text-2xl">Learning outcomes</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.learning_outcomes}
          </p>
        </section>
      ) : null}

      {program.lecturer ? <LecturerSection lecturer={program.lecturer} /> : null}

      <section className="mt-12">
        <h2 className="text-2xl">Schedule</h2>
        <ScheduleTable sessions={program.sessions} />
      </section>
    </article>
  );
}

function RegisterCta({
  slug,
  status,
  alreadyRegistered,
  fullyBooked,
  registrationOpen,
}: {
  slug: string;
  status: string;
  alreadyRegistered: boolean;
  fullyBooked: boolean;
  registrationOpen: boolean;
}) {
  if (alreadyRegistered) {
    return <ProgramRegisterForm slug={slug} alreadyRegistered />;
  }

  if (fullyBooked) {
    return <DisabledCta label="Fully Booked" />;
  }

  if (registrationOpen) {
    return <ProgramRegisterForm slug={slug} />;
  }

  if (status === "registration_open") {
    return <DisabledCta label="Registration closed" />;
  }

  return <DisabledCta label={statusLabel(status)} />;
}

function DisabledCta({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-sm border border-ink/20 bg-paper-muted px-6 text-sm text-ink-muted"
    >
      {label}
    </button>
  );
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="text-ink">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function programDateLine(program: ProgramDetail) {
  const start = formatDate(program.start_date);
  const end = formatDate(program.end_date);
  if (start && end) {
    return `${start} – ${end}`;
  }
  return start ? `Starts ${start}` : end ? `Ends ${end}` : null;
}

function programCapacityLine(program: ProgramDetail) {
  if (!program.max_participants) {
    return null;
  }
  if (program.registeredCount == null) {
    return `Up to ${program.max_participants} participants`;
  }
  return `${program.registeredCount} of ${program.max_participants} places filled`;
}

function LecturerSection({
  lecturer,
}: {
  lecturer: NonNullable<ProgramDetail["lecturer"]>;
}) {
  const initials = lecturer.full_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className="mt-12">
      <h2 className="text-2xl">Lecturer</h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row">
        {lecturer.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lecturer.photo_url}
            alt={lecturer.full_name}
            className="h-36 w-36 max-w-full shrink-0 object-cover"
          />
        ) : (
          <div
            className="flex h-36 w-36 shrink-0 items-center justify-center bg-paper-muted font-serif text-2xl text-ink-muted"
            aria-hidden="true"
          >
            {initials || "—"}
          </div>
        )}
        <div>
          <h3 className="text-xl">{lecturer.full_name}</h3>
          {lecturer.title ? (
            <p className="mt-1 text-sm tracking-wide text-accent">{lecturer.title}</p>
          ) : null}
          {lecturer.bio ? (
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{lecturer.bio}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ScheduleTable({ sessions }: { sessions: ProgramSession[] }) {
  if (sessions.length === 0) {
    return (
      <p className="mt-3 text-sm text-ink-muted">No sessions are listed yet.</p>
    );
  }

  return (
    <>
      <ul className="mt-4 space-y-3 sm:hidden">
        {sessions.map((session) => (
          <li
            key={session.id}
            className="border border-ink/10 bg-paper p-4 text-sm leading-relaxed"
          >
            <p className="text-ink">{formatDate(session.session_date)}</p>
            <p className="mt-1 text-ink-muted">
              {formatTime(session.start_time)} – {formatTime(session.end_time)}
            </p>
            <p className="mt-1 text-ink-muted">{formatLabel(session.format)}</p>
            <p className="mt-1 text-ink-muted">
              {session.format === "online" ? "Online" : session.location || "—"}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Time</th>
              <th className="py-2 pr-4 font-medium">Format</th>
              <th className="py-2 font-medium">Location</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-ink/10">
                <td className="py-3 pr-4 text-ink">
                  {formatDate(session.session_date)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                  {formatTime(session.start_time)} – {formatTime(session.end_time)}
                </td>
                <td className="py-3 pr-4 text-ink-muted">
                  {formatLabel(session.format)}
                </td>
                <td className="py-3 text-ink-muted">
                  {session.format === "online"
                    ? "Online"
                    : session.location || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
