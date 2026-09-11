import type { Metadata } from "next";
import { safeNextPath } from "@/lib/auth-paths";
import { publicPages } from "@/lib/seo";
import { RegisterForm } from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  return publicPages.register;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/dashboard");

  return (
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Register</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Create a student account to register for programs.
      </p>
      <div className="mt-8">
        <RegisterForm next={next} />
      </div>
    </section>
  );
}
