import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { emptyFaqFormValues } from "@/lib/admin-faq";
import { requireAdmin } from "@/lib/require-auth";
import { FaqForm } from "../faq-form";

export async function generateMetadata() {
  const t = await getTranslations("admin");
  return { title: t("newFaq") };
}

export default async function NewFaqPage() {
  const t = await getTranslations("admin");
  await requireAdmin();
  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/faq" className="text-ink-muted hover:text-accent">
          {t("faq")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("newFaq")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("newFaqLead")}
      </p>
      <FaqForm mode="create" item={emptyFaqFormValues} />
    </section>
  );
}
