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
        {/* PLACEHOLDER: Intro */}
        <PlaceholderComment name="Intro" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {t("intro")}
        </p>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("missionTitle")}</h2>
          <PlaceholderComment name="Mission" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("mission")}
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("visionTitle")}</h2>
          <PlaceholderComment name="Vision" />
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">
            {t("vision")}
          </p>
        </div>
      </section>

      <section className="border-t border-ink/10">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("objectivesTitle")}</h2>
          <PlaceholderComment name="Objectives" />
          <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-base leading-relaxed text-ink-muted">
            <li>{t("objective1")}</li>
            <li>{t("objective2")}</li>
            <li>{t("objective3")}</li>
            <li>{t("objective4")}</li>
          </ul>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-paper-muted/50">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl">{t("areasTitle")}</h2>
          <PlaceholderComment name="Main Areas of Activity" />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">{t("coursesTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t("coursesBody")}
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">{t("trainingTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t("trainingBody")}
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">{t("literacyTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t("literacyBody")}
              </p>
            </article>
            <article className="border border-ink/10 bg-paper p-5">
              <h3 className="text-xl">{t("curriculumTitle")}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t("curriculumBody")}
              </p>
            </article>
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
