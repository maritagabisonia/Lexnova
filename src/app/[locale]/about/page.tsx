import { getTranslations } from "next-intl/server";
import {
  getAboutTeamLecturers,
  type AboutTeamLecturer,
} from "@/lib/catalog";
import { seoMetadata } from "@/lib/page-metadata";

const coreAreaKeys = [
  "tax",
  "administrative",
  "administrativeProcedure",
  "administrativeOffenses",
  "ai",
  "criminal",
  "criminalProcedure",
  "transport",
  "energy",
  "civil",
  "labor",
  "business",
] as const;

const distinctiveAreaKeys = [
  "anthropology",
  "philosophy",
  "sociology",
  "legalCulture",
  "education",
  "childrensRights",
  "sustainableDevelopment",
  "media",
  "medical",
  "culturalHeritage",
] as const;

export async function generateMetadata() {
  return seoMetadata("about");
}

function lecturerInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function AboutTeamCard({ lecturer }: { lecturer: AboutTeamLecturer }) {
  const initials = lecturerInitials(lecturer.full_name);

  return (
    <article className="flex h-full flex-col border border-ink/10 bg-paper p-5">
      {lecturer.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lecturer.photo_url}
          alt={lecturer.full_name}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div
          className="flex aspect-[4/3] w-full items-center justify-center bg-paper-muted text-2xl font-serif tracking-wide text-ink-muted"
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
      <h3 className="mt-4 text-xl">{lecturer.full_name}</h3>
      {lecturer.title ? (
        <p className="mt-1 text-sm tracking-wide text-accent">{lecturer.title}</p>
      ) : null}
      {lecturer.bio ? (
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{lecturer.bio}</p>
      ) : null}
    </article>
  );
}

async function AboutTeamSection() {
  const t = await getTranslations("about");
  const team = await getAboutTeamLecturers();

  if (team.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-ink/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl">{t("teamTitle")}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {team.map((lecturer) => (
            <AboutTeamCard key={lecturer.id} lecturer={lecturer} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-sm tracking-wide text-accent">{t("eyebrow")}</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl">{t("headline")}</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {t("intro1")}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {t("intro2")}
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("missionTitle")}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("mission1")}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("mission2")}
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("visionTitle")}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("vision1")}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("vision2")}
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("objectivesTitle")}</h2>
          <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-base leading-relaxed text-ink-muted">
            <li>{t("objective1")}</li>
            <li>{t("objective2")}</li>
            <li>{t("objective3")}</li>
            <li>{t("objective4")}</li>
            <li>{t("objective5")}</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("coreAreasTitle")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {coreAreaKeys.map((key) => (
              <article key={key} className="border border-ink/10 bg-paper p-5">
                <h3 className="text-xl">{t(`coreAreas.${key}`)}</h3>
              </article>
            ))}
          </div>
          <h2 className="mt-16 text-3xl">{t("distinctiveAreasTitle")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {distinctiveAreaKeys.map((key) => (
              <article key={key} className="border border-ink/10 bg-paper p-5">
                <h3 className="text-xl">{t(`distinctiveAreas.${key}`)}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AboutTeamSection />
    </div>
  );
}
