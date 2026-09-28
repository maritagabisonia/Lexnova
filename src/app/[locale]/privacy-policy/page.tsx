import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { seoMetadata } from "@/lib/page-metadata";
import { site } from "@/lib/site";

export async function generateMetadata() {
  return seoMetadata("privacyPolicy");
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal.privacy");
  const vars = { name: site.name, email: site.email, address: site.address };

  return (
    <LegalPage
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      sections={[
        { heading: t("whoWeAre.heading"), paragraphs: [t("whoWeAre.p1", vars)] },
        {
          heading: t("whatWeCollect.heading"),
          paragraphs: [
            t("whatWeCollect.p1"),
            t("whatWeCollect.p2"),
            t("whatWeCollect.p3"),
            t("whatWeCollect.p4"),
          ],
        },
        {
          heading: t("whyWeUse.heading"),
          paragraphs: [t("whyWeUse.p1"), t("whyWeUse.p2")],
        },
        {
          heading: t("whoSees.heading"),
          paragraphs: [t("whoSees.p1"), t("whoSees.p2"), t("whoSees.p3")],
        },
        { heading: t("howLong.heading"), paragraphs: [t("howLong.p1")] },
        { heading: t("choices.heading"), paragraphs: [t("choices.p1")] },
        { heading: t("children.heading"), paragraphs: [t("children.p1")] },
        { heading: t("changes.heading"), paragraphs: [t("changes.p1")] },
      ]}
    />
  );
}
