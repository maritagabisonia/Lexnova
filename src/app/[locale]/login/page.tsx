import { getTranslations } from "next-intl/server";
import { safeNextPath } from "@/lib/auth-paths";
import { seoMetadata } from "@/lib/page-metadata";
import { LoginForm } from "./login-form";

export async function generateMetadata() {
  return seoMetadata("login");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const t = await getTranslations("auth");
  const params = await searchParams;
  const resetFailed = params.error === "reset";
  const next = safeNextPath(params.next, "/dashboard");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("loginTitle")}</h1>
      <p className="mt-3 text-sm text-ink-muted">
        {next.startsWith("/programs/") ? t("loginForProgram") : t("loginManage")}
      </p>
      {resetFailed ? (
        <p
          role="alert"
          className="mt-6 border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
        >
          {t("errors.expiredLink")}
        </p>
      ) : null}
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </section>
  );
}
