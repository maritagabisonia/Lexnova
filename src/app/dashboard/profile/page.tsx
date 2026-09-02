import type { Metadata } from "next";
import { requireUser } from "@/lib/require-auth";
import { ProfileForms } from "./profile-forms";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
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
    <section className="mx-auto w-full max-w-md flex-1 px-6 py-16">
      <h1 className="text-3xl sm:text-4xl">Profile</h1>
      <p className="mt-3 text-sm text-ink-muted">
        Update your name or choose a new password.
      </p>
      <ProfileForms fullName={fullName} email={email} />
    </section>
  );
}
