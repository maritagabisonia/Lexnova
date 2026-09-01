import { requireUser } from "@/lib/require-auth";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  await requireUser();
  return children;
}
