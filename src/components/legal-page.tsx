import { getTranslations } from "next-intl/server";

function PlaceholderComment({ name }: { name: string }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: `<!-- PLACEHOLDER: ${name} — review with a lawyer before real launch -->`,
      }}
    />
  );
}

export async function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
}) {
  const t = await getTranslations("legalPage");

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
      {/* PLACEHOLDER: This legal copy should be reviewed by a lawyer before real launch. */}
      <PlaceholderComment name={`${title} legal copy`} />
      <p className="text-sm tracking-wide text-accent">{t("placeholder")}</p>
      <h1 className="mt-3 text-3xl sm:text-5xl">{title}</h1>
      <p
        role="note"
        className="mt-6 border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
      >
        {t("disclaimer")}
      </p>
      <p className="mt-6 text-sm text-ink-muted">
        {t("lastUpdated", { date: lastUpdated })}
      </p>
      <p className="mt-6 text-base leading-relaxed text-ink-muted">{intro}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.heading}-${index}`}
                className="mt-3 text-base leading-relaxed text-ink-muted"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
