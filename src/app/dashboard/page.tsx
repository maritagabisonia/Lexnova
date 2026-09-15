import { redirect } from "next/navigation";
import { requireUser } from "@/lib/require-auth";

export default async function DashboardIndexPage() {
  await requireUser();
  redirect("/dashboard/courses");
}
