import { getTranslations } from "next-intl/server";
import { seoMetadata } from "@/lib/page-metadata";
import { requireUser } from "@/lib/require-auth";
import { ProfileForms } from "./profile-forms";

export async function generateMetadata() {
  return seoMetadata("profile");
}

export default async function ProfilePage() {
  const t = await getTranslations("dashboard");
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const fullName =
    profile?.full_name ??
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "");
  const email = profile?.email || user.email || "";

  return (
    <section>
      <h1 className="text-3xl sm:text-4xl">{t("profile")}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t("profileLead")}</p>
      <div className="max-w-md">
        <ProfileForms fullName={fullName} email={email} />
      </div>
    </section>
  );
}
