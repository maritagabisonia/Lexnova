import { AdminNav } from "@/components/admin-nav";
import { dashboardDisplayName } from "@/lib/dashboard";
import { requireAdmin } from "@/lib/require-auth";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const { supabase, user } = await requireAdmin();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const name = dashboardDisplayName({
    fullName: profile?.full_name,
    metadataName: user.user_metadata?.full_name,
    email: profile?.email || user.email,
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b border-ink/10 md:hidden">
        <div className="px-4 py-4 sm:px-6">
          <p className="text-xs tracking-wide text-ink-muted">Admin</p>
          <p className="mt-1 font-serif text-2xl tracking-tight text-ink">{name}</p>
        </div>
        <AdminNav variant="tabs" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-ink/10 md:flex md:flex-col">
          <div className="px-6 py-8">
            <p className="text-xs tracking-wide text-ink-muted">Admin</p>
            <p className="mt-2 font-serif text-2xl tracking-tight text-ink">{name}</p>
          </div>
          <AdminNav variant="sidebar" />
        </aside>
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
