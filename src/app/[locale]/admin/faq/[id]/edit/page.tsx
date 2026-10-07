import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getAdminFaq } from "@/lib/admin-faq";
import { requireAdmin } from "@/lib/require-auth";
import { FaqForm } from "../../faq-form";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("admin");
  const item = await getAdminFaq(id);
  const name = item?.question_ka.trim() || item?.question.trim();
  return {
    title: name ? t("editNamed", { name }) : t("editFaq"),
  };
}

export default async function EditFaqPage({ params }: Props) {
  const t = await getTranslations("admin");
  await requireAdmin();
  const { id } = await params;
  const item = await getAdminFaq(id);
  if (!item?.id) {
    notFound();
  }

  return (
    <section>
      <p className="text-sm">
        <Link href="/admin/faq" className="text-ink-muted hover:text-accent">
          {t("faq")}
        </Link>
      </p>
      <h1 className="mt-3 text-3xl sm:text-4xl">{t("editFaq")}</h1>
      <p className="mt-3 max-w-xl text-sm text-ink-muted sm:text-base">
        {t("editFaqLead")}
      </p>
      <FaqForm mode="edit" item={item} />
    </section>
  );
}
