import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { seoMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";

export async function generateMetadata() {
  return seoMetadata("terms");
}

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");
  const vars = { name: site.name, email: site.email };

  return (
    <LegalPage
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      sections={[
        { heading: t("theSite.heading"), paragraphs: [t("theSite.p1", vars)] },
        { heading: t("accounts.heading"), paragraphs: [t("accounts.p1")] },
        {
          heading: t("registrations.heading"),
          paragraphs: [t("registrations.p1")],
        },
        {
          heading: t("acceptableUse.heading"),
          paragraphs: [t("acceptableUse.p1")],
        },
        { heading: t("disclaimers.heading"), paragraphs: [t("disclaimers.p1")] },
        {
          heading: t("governingLaw.heading"),
          paragraphs: [t("governingLaw.p1")],
        },
        { heading: t("contact.heading"), paragraphs: [t("contact.p1", vars)] },
      ]}
    />
  );
}
