import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { termsOfUse } from "@/lib/legal";
import { publicPages } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.terms;
}

export default function TermsPage() {
  return (
    <LegalPage
      title={termsOfUse.title}
      lastUpdated={termsOfUse.lastUpdated}
      intro={termsOfUse.intro}
      sections={termsOfUse.sections}
    />
  );
}
