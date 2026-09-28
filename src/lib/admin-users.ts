import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { formatAdminDate } from "@/lib/admin-format";
import { formatRegisteredAt } from "@/lib/admin-registrations";
import { localizedText } from "@/lib/localized-content";
import {
  translatedStatusLabel,
  translatedTypeLabel,
} from "@/lib/program-display";
import { createClient } from "@/lib/supabase/server";
import {
  isProfileRole,
  roleLabel,
  type AdminUserRow,
} from "@/lib/user-roles";

export type { AdminUserRow, ProfileRole } from "@/lib/user-roles";
export { isProfileRole, profileRoles, roleLabel } from "@/lib/user-roles";

export type AdminUserRegistration = {
  id: string;
  programId: string;
  programTitle: string;
  typeLabel: string;
  programStatusLabel: string;
  status: string;
  statusLabel: string;
  registeredAt: string;
};

export type AdminUserDetail = AdminUserRow & {
  registrations: AdminUserRegistration[];
};

function formatJoinDate(value: string | null, locale: string) {
  return formatAdminDate(value, locale);
}

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toUserRow(
  row: {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string;
    created_at: string;
  },
  locale: string,
  fallbackName: string,
): AdminUserRow {
  const role = isProfileRole(row.role) ? row.role : "student";
  return {
    id: row.id,
    name: row.full_name?.trim() || fallbackName,
    email: row.email?.trim() || "—",
    role,
    roleLabel: roleLabel(role),
    joinedAt: formatJoinDate(row.created_at, locale),
  };
}

export const getAdminUsers = cache(async function getAdminUsers(): Promise<
  AdminUserRow[]
> {
  try {
    const locale = await getLocale();
    const t = await getTranslations("admin");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .order("full_name", { ascending: true });
    if (error || !data) {
      if (error) {
        console.error("Admin users list failed:", error);
      }
      return [];
    }
    return data.map((row) => toUserRow(row, locale, t("fallbackUser")));
  } catch (error) {
    console.error("Admin users list failed:", error);
    return [];
  }
});

export const getAdminUser = cache(async function getAdminUser(
  id: string,
): Promise<AdminUserDetail | null> {
  try {
    const locale = await getLocale();
    const t = await getTranslations("admin");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      if (error) {
        console.error("Admin user lookup failed:", error);
      }
      return null;
    }

    const registrations = await getAdminUserRegistrations(id);
    return { ...toUserRow(data, locale, t("fallbackUser")), registrations };
  } catch (error) {
    console.error("Admin user lookup failed:", error);
    return null;
  }
});

export const getAdminUserRegistrations = cache(
  async function getAdminUserRegistrations(
    studentId: string,
  ): Promise<AdminUserRegistration[]> {
    try {
      const locale = await getLocale();
      const t = await getTranslations("admin");
      const programsT = await getTranslations("programs");
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("registrations")
        .select(
          "id, program_id, status, registered_at, programs(id, title, title_ka, type, status)",
        )
        .eq("student_id", studentId)
        .order("registered_at", { ascending: false });

      if (error || !data) {
        if (error) {
          console.error("Admin user registrations failed:", error);
        }
        return [];
      }

      return data.map((row) => {
        const program = asOne(
          row.programs as
            | {
                id: string;
                title: string | null;
                title_ka?: string | null;
                type: string | null;
                status: string | null;
              }
            | {
                id: string;
                title: string | null;
                title_ka?: string | null;
                type: string | null;
                status: string | null;
              }[]
            | null,
        );
        return {
          id: row.id,
          programId: program?.id ?? row.program_id,
          programTitle: localizedText("en", program?.title_ka, program?.title) || t("program"),
          typeLabel: translatedTypeLabel(program?.type ?? "", programsT),
          programStatusLabel: translatedStatusLabel(program?.status ?? "", programsT),
          status: row.status,
          statusLabel:
            row.status === "confirmed"
              ? t("confirmed")
              : row.status === "cancelled"
                ? t("cancelled")
                : row.status.replaceAll("_", " "),
          registeredAt: formatRegisteredAt(row.registered_at, locale),
        };
      });
    } catch (error) {
      console.error("Admin user registrations failed:", error);
      return [];
    }
  },
);
