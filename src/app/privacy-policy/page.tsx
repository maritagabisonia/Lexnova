import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacyPolicy } from "@/lib/legal";
import { publicPages } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.privacyPolicy;
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={privacyPolicy.title}
      lastUpdated={privacyPolicy.lastUpdated}
      intro={privacyPolicy.intro}
      sections={privacyPolicy.sections}
    />
  );
}
