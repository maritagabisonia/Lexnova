import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { seoMetadata } from "@/lib/page-metadata";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export async function generateMetadata() {
  return seoMetadata("resetPassword");
}

export default async function ResetPasswordPage() {
  const t = await getTranslations("auth");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("resetTitle")}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t("resetLead")}</p>
      <div className="mt-8">
        {user ? (
          <ResetPasswordForm />
        ) : (
          <div className="space-y-5">
            <p
              role="alert"
              className="border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
            >
              {t("errors.expiredLink")}
            </p>
            <p className="text-center text-sm text-ink-muted">
              <Link href="/forgot-password" className="hover:text-accent">
                {t("requestNewLink")}
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
