import { getTranslations } from "next-intl/server";
import { seoMetadata } from "@/lib/page-metadata";
import { ForgotPasswordForm } from "./forgot-password-form";

export async function generateMetadata() {
  return seoMetadata("forgotPassword");
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("forgotTitle")}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t("forgotLead")}</p>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
