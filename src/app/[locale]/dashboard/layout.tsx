import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { DashboardNav } from "@/components/dashboard-nav";
import { dashboardDisplayName } from "@/lib/dashboard";
import { requireUser } from "@/lib/require-auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations("dashboard");
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const name = dashboardDisplayName({
    fullName: profile?.full_name,
    metadataName: user.user_metadata?.full_name,
    email: profile?.email || user.email,
    fallback: t("fallbackName"),
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-ink/10 md:hidden">
        <div className="px-4 py-4 sm:px-6">
          <p className="text-xs tracking-wide text-ink-muted">{t("account")}</p>
          <p className="mt-1 font-serif text-2xl tracking-tight text-ink">{name}</p>
        </div>
        <DashboardNav variant="tabs" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-ink/10 md:flex md:flex-col">
          <div className="px-6 py-8">
            <p className="text-xs tracking-wide text-ink-muted">{t("account")}</p>
            <p className="mt-2 font-serif text-2xl tracking-tight text-ink">{name}</p>
          </div>
          <DashboardNav variant="sidebar" />
        </aside>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
