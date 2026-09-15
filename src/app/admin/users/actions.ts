"use server";

import { revalidatePath } from "next/cache";
import { isProfileRole, roleLabel } from "@/lib/admin-users";
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
  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();

  if (!userId) {
    return { error: "We could not find that user." };
  }
  if (!isProfileRole(role)) {
    return { error: "Choose student, teacher, or admin." };
  }
  if (userId === user.id) {
    return { error: "You cannot change your own role." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Update user role failed:", error);
    return { error: "We could not update that role. Try again." };
  }

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/", "layout");
  return { success: `Role updated to ${roleLabel(role)}.` };
}
