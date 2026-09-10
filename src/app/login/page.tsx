import type { Metadata } from "next";
import { publicPages } from "@/lib/seo";
import { LoginForm } from "./login-form";
import { safeNextPath } from "@/lib/auth-paths";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.login;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const resetFailed = params.error === "reset";
  const next = safeNextPath(params.next, "/dashboard");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Log in</h1>
      <p className="mt-3 text-sm text-ink-muted">
        {next.startsWith("/programs/")
          ? "Sign in to complete your registration."
          : "Sign in to manage your registrations."}
      </p>
      {resetFailed ? (
        <p
          role="alert"
          className="mt-6 border-l-4 border-accent bg-paper-muted px-3 py-2 text-sm text-ink"
        >
          This reset link has expired. Please request a new one.
        </p>
      ) : null}
      <div className="mt-8">
        <LoginForm next={next} />
      </div>
    </section>
  );
}
