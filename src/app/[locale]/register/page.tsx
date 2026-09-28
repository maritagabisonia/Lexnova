import { getTranslations } from "next-intl/server";
import { safeNextPath } from "@/lib/auth-paths";
import { seoMetadata } from "@/lib/page-metadata";
import { RegisterForm } from "./register-form";

export async function generateMetadata() {
  return seoMetadata("register");
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const t = await getTranslations("auth");
  const params = await searchParams;
  const next = safeNextPath(params.next, "/dashboard");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("registerTitle")}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t("registerLead")}</p>
      <div className="mt-8">
        <RegisterForm next={next} />
      </div>
    </section>
  );
}
