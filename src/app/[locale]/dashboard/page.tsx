import { redirect } from "@/i18n/redirect";
import { requireUser } from "@/lib/require-auth";

export default async function DashboardIndexPage() {
  await requireUser();
  return redirect("/dashboard/courses");
}
