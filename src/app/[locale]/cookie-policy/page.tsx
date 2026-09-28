import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { seoMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return seoMetadata("cookiePolicy");
}

export default async function CookiePolicyPage() {
  const t = await getTranslations("legal.cookies");

  return (
    <LegalPage
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={t("intro")}
      sections={[
        {
          heading: t("whatWeUse.heading"),
          paragraphs: [t("whatWeUse.p1"), t("whatWeUse.p2"), t("whatWeUse.p3")],
        },
        { heading: t("howLong.heading"), paragraphs: [t("howLong.p1")] },
        {
          heading: t("control.heading"),
          paragraphs: [t("control.p1"), t("control.p2")],
        },
      ]}
    />
  );
}
