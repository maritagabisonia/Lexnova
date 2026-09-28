"use server";

import { getTranslations } from "next-intl/server";
import { revalidateLocalized } from "@/lib/revalidate";
import { parseUuid } from "@/lib/form-input";
import { isProfileRole } from "@/lib/user-roles";
import { requireAdmin } from "@/lib/require-auth";
import { createServiceClient } from "@/lib/supabase/service";

export type UserRoleActionState = {
  error?: string;
  success?: string;
};

export async function updateUserRole(
  _prev: UserRoleActionState,
  formData: FormData,
): Promise<UserRoleActionState> {
  const { user } = await requireAdmin();
  const t = await getTranslations("admin.errors");
  const roles = await getTranslations("roles");
  const userId = parseUuid(String(formData.get("userId") ?? ""), t("notFoundUser"));
  const role = String(formData.get("role") ?? "").trim();

  if ("error" in userId) {
    return { error: userId.error };
  }
  if (!isProfileRole(role)) {
    return { error: t("chooseRole") };
  }
  if (userId.id === user.id) {
    return { error: t("ownRole") };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId.id);

  if (error) {
    console.error("Update user role failed:", error);
    return { error: t("updateRole") };
  }

  revalidateLocalized("/admin/users");
  revalidateLocalized(`/admin/users/${userId.id}`);
  revalidateLocalized("/", "layout");
  const success = await getTranslations("admin");
  return { success: success("roleUpdated", { role: roles(role) }) };
}
