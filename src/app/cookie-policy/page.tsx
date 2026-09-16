import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { cookiePolicy } from "@/lib/legal";
import { publicPages } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.cookiePolicy;
}

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title={cookiePolicy.title}
      lastUpdated={cookiePolicy.lastUpdated}
      intro={cookiePolicy.intro}
      sections={cookiePolicy.sections}
    />
  );
}
