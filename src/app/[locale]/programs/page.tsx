import { getTranslations } from "next-intl/server";
import { ProgramsCatalog } from "@/components/programs-catalog";
import { getPrograms } from "@/lib/catalog";
import { seoMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return seoMetadata("programs");
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const t = await getTranslations("programs");
  const { type } = await searchParams;
  const programs = await getPrograms();

  return (
    <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl sm:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted sm:text-base">
        {t("intro")}
      </p>
      <ProgramsCatalog programs={programs} initialType={type} />
    </section>
  );
}
