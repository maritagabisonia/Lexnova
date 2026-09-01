import { requireAdmin } from "@/lib/require-auth";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  await requireAdmin();
  return children;
}
