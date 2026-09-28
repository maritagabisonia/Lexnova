import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { seoMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return seoMetadata("notFound");
}

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("notFoundTitle")}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t("notFoundBody")}</p>
      <p className="mt-8 text-sm text-ink-muted">
        <Link href="/" className="text-ink hover:text-accent">
          {t("backHome")}
        </Link>
      </p>
    </section>
  );
}
