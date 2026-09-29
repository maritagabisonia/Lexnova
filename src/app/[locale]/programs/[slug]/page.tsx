import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  formatDate,
  formatTime,
  getProgramBySlug,
  isRegistrationDeadlineOpen,
  statusBadgeClass,
  translatedFormatLabel,
  translatedStatusLabel,
  translatedTypeLabel,
  typeBadgeClass,
  type ProgramDetail,
  type ProgramSession,
} from "@/lib/catalog";
import { descriptionFromFields } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";
import { ProgramRegisterForm } from "./register-form";

type Props = {
  params: Promise<{ slug: string }>;
};

type ProgramsT = Awaited<ReturnType<typeof getTranslations>>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations("seo.programFallback");
  const programsT = await getTranslations("programs");
  const program = await getProgramBySlug(slug);
  if (!program) {
    return { title: t("title") };
  }

  return {
    title: program.title,
    description:
      descriptionFromFields(program.short_description, program.full_description) ??
      t("description", { type: translatedTypeLabel(program.type, programsT).toLowerCase() }),
  };
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const t = await getTranslations("programs");
  const locale = await getLocale();
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

  const comingSoon = program.status === "coming_soon";
  const deadlineOpen = isRegistrationDeadlineOpen(program.registration_deadline);
  const fullyBooked =
    program.max_participants != null &&
    program.registeredCount != null &&
    program.registeredCount >= program.max_participants;
  const registrationOpen =
    !comingSoon && program.status === "registration_open" && deadlineOpen;
  const showLocation =
    !comingSoon && program.format !== "online" && Boolean(program.location);
  const dateLine = comingSoon ? null : programDateLine(program, t, locale);
  const capacityLine = comingSoon ? null : programCapacityLine(program, t);

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      <p className="text-sm text-ink-muted">
        <Link href="/programs" className="inline-flex min-h-11 items-center hover:text-accent">
          {t("breadcrumb")}
        </Link>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${typeBadgeClass(program.type)}`}
        >
          {translatedTypeLabel(program.type, t)}
        </span>
        <span
          className={`border px-2 py-0.5 text-xs tracking-wide ${statusBadgeClass(program.status)}`}
        >
          {translatedStatusLabel(program.status, t)}
        </span>
      </div>

      <h1 className="mt-4 text-3xl sm:text-5xl">{program.title}</h1>

      {comingSoon ? null : (
        <dl className="mt-6 space-y-2 text-sm text-ink-muted">
          <Fact label={t("format")} value={translatedFormatLabel(program.format, t)} />
          {dateLine ? <Fact label={t("dates")} value={dateLine} /> : null}
          {program.duration_text ? (
            <Fact label={t("duration")} value={program.duration_text} />
          ) : null}
          {program.registration_deadline ? (
            <Fact
              label={t("deadline")}
              value={formatDate(program.registration_deadline, locale) ?? undefined}
            />
          ) : null}
          {showLocation ? (
            <Fact label={t("location")} value={program.location ?? undefined} />
          ) : null}
          {capacityLine ? <Fact label={t("places")} value={capacityLine} /> : null}
        </dl>
      )}

      <div className="mt-8">
        <RegisterCta
          slug={program.slug}
          status={program.status}
          loggedIn={Boolean(user)}
          alreadyRegistered={alreadyRegistered}
          fullyBooked={fullyBooked}
          registrationOpen={registrationOpen}
          t={t}
        />
      </div>

      <div className="mt-10 whitespace-pre-wrap text-base leading-relaxed text-ink">
        {program.full_description ||
          program.short_description ||
          t("detailsFallback")}
      </div>

      {program.target_audience ? (
        <section className="mt-12">
          <h2 className="text-2xl">{t("targetAudience")}</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.target_audience}
          </p>
        </section>
      ) : null}

      {program.objectives ? (
        <section className="mt-12">
          <h2 className="text-2xl">{t("objectives")}</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.objectives}
          </p>
        </section>
      ) : null}

      {program.learning_outcomes ? (
        <section className="mt-12">
          <h2 className="text-2xl">{t("learningOutcomes")}</h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink-muted">
            {program.learning_outcomes}
          </p>
        </section>
      ) : null}

      {program.lecturer && !comingSoon ? (
        <LecturerSection lecturer={program.lecturer} t={t} />
      ) : null}

      {comingSoon ? null : (
        <section className="mt-12">
          <h2 className="text-2xl">{t("schedule")}</h2>
          <ScheduleTable sessions={program.sessions} t={t} locale={locale} />
        </section>
      )}
    </article>
  );
}

function RegisterCta({
  slug,
  status,
  loggedIn,
  alreadyRegistered,
  fullyBooked,
  registrationOpen,
  t,
}: {
  slug: string;
  status: string;
  loggedIn: boolean;
  alreadyRegistered: boolean;
  fullyBooked: boolean;
  registrationOpen: boolean;
  t: ProgramsT;
}) {
  if (alreadyRegistered) {
    return <ProgramRegisterForm slug={slug} alreadyRegistered />;
  }

  if (status === "coming_soon") {
    return <DisabledCta label={t("statusComingSoon")} />;
  }

  if (fullyBooked) {
    return <DisabledCta label={t("fullyBooked")} />;
  }

  if (registrationOpen) {
    if (!loggedIn) {
      return (
        <Link
          href={`/login?next=${encodeURIComponent(`/programs/${slug}`)}`}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-ink px-6 text-sm text-paper transition-colors hover:bg-ink-muted"
        >
          {t("register")}
        </Link>
      );
    }

    return <ProgramRegisterForm slug={slug} />;
  }

  if (status === "registration_open") {
    return <DisabledCta label={t("registrationClosed")} />;
  }

  return <DisabledCta label={translatedStatusLabel(status, t)} />;
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

function programDateLine(program: ProgramDetail, t: ProgramsT, locale: string) {
  const start = formatDate(program.start_date, locale);
  const end = formatDate(program.end_date, locale);
  if (start && end) {
    return t("dateRange", { start, end });
  }
  return start ? t("startsOn", { date: start }) : end ? t("endsOn", { date: end }) : null;
}

function programCapacityLine(program: ProgramDetail, t: ProgramsT) {
  if (!program.max_participants) {
    return null;
  }
  if (program.registeredCount == null) {
    return t("upToPlaces", { count: program.max_participants });
  }
  return t("placesFilled", {
    filled: program.registeredCount,
    total: program.max_participants,
  });
}

function LecturerSection({
  lecturer,
  t,
}: {
  lecturer: NonNullable<ProgramDetail["lecturer"]>;
  t: ProgramsT;
}) {
  const initials = lecturer.full_name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className="mt-12">
      <h2 className="text-2xl">{t("lecturer")}</h2>
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
            {initials || t("emDash")}
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

function ScheduleTable({
  sessions,
  t,
  locale,
}: {
  sessions: ProgramSession[];
  t: ProgramsT;
  locale: string;
}) {
  if (sessions.length === 0) {
    return (
      <p className="mt-3 text-sm text-ink-muted">{t("noSessions")}</p>
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
            <p className="text-ink">{formatDate(session.session_date, locale)}</p>
            <p className="mt-1 text-ink-muted">
              {formatTime(session.start_time)} – {formatTime(session.end_time)}
            </p>
            <p className="mt-1 text-ink-muted">{translatedFormatLabel(session.format, t)}</p>
            <p className="mt-1 text-ink-muted">
              {session.format === "online" ? t("online") : session.location || t("emDash")}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-ink/15 text-xs tracking-wide text-ink-muted">
              <th className="py-2 pr-4 font-medium">{t("date")}</th>
              <th className="py-2 pr-4 font-medium">{t("time")}</th>
              <th className="py-2 pr-4 font-medium">{t("format")}</th>
              <th className="py-2 font-medium">{t("location")}</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="border-b border-ink/10">
                <td className="py-3 pr-4 text-ink">
                  {formatDate(session.session_date, locale)}
                </td>
                <td className="whitespace-nowrap py-3 pr-4 text-ink-muted">
                  {formatTime(session.start_time)} – {formatTime(session.end_time)}
                </td>
                <td className="py-3 pr-4 text-ink-muted">
                  {translatedFormatLabel(session.format, t)}
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
