import { getTranslations } from "next-intl/server";
import { seoMetadata } from "@/lib/page-metadata";

function PlaceholderComment({ name }: { name: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!-- PLACEHOLDER: ${name} — replace this copy -->`,
      }}
    />
  );
}

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

export default async function AboutPage() {
  const t = await getTranslations("about");
  const team = ["amelia", "julian", "noor"] as const;

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

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("teamTitle")}</h2>
          <PlaceholderComment name="Team" />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((person) => (
              <article
                key={person}
                className="flex h-full flex-col border border-ink/10 bg-paper p-5"
              >
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center bg-paper-muted text-2xl font-serif tracking-wide text-ink-muted"
                  aria-hidden="true"
                >
                  {t(`team.${person}.initials`)}
                </div>
                <h3 className="mt-4 text-xl">{t(`team.${person}.name`)}</h3>
                <p className="mt-1 text-sm tracking-wide text-accent">
                  {t(`team.${person}.role`)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {t(`team.${person}.bio`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
