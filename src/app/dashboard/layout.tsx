import Link from "next/link";
import { requireUser } from "@/lib/require-auth";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await requireUser();

  return (
    <div className="flex flex-1 flex-col">
      <nav
        className="mx-auto flex w-full max-w-md gap-6 px-6 pt-8 text-sm"
        aria-label="Account"
      >
        <Link href="/dashboard" className="text-ink-muted hover:text-accent">
          Dashboard
        </Link>
        <Link href="/dashboard/profile" className="text-ink-muted hover:text-accent">
          Profile
        </Link>
      </nav>
      {children}
    </div>
  );
}
