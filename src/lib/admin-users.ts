import { cache } from "react";
import { formatRegisteredAt } from "@/lib/admin-registrations";
import { statusLabel, typeLabel } from "@/lib/program-display";
import { createClient } from "@/lib/supabase/server";

export const profileRoles = ["student", "teacher", "admin"] as const;
export type ProfileRole = (typeof profileRoles)[number];

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: ProfileRole;
  roleLabel: string;
  joinedAt: string;
};

export type AdminUserDetail = AdminUserRow & {
  registrations: AdminUserRegistration[];
};

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

const roleLabels: Record<ProfileRole, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

export function roleLabel(role: string) {
  if (isProfileRole(role)) {
    return roleLabels[role];
  }
  return role;
}

export function isProfileRole(value: string): value is ProfileRole {
  return (profileRoles as readonly string[]).includes(value);
}

function formatJoinDate(value: string | null) {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function registrationStatusLabel(status: string) {
  if (status === "confirmed") {
    return "Confirmed";
  }
  if (status === "cancelled") {
    return "Cancelled";
  }
  return status.replaceAll("_", " ");
}

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function toUserRow(row: {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
}): AdminUserRow {
  const role = isProfileRole(row.role) ? row.role : "student";
  return {
    id: row.id,
    name: row.full_name?.trim() || "User",
    email: row.email?.trim() || "—",
    role,
    roleLabel: roleLabel(role),
    joinedAt: formatJoinDate(row.created_at),
  };
}

export const getAdminUsers = cache(async function getAdminUsers(): Promise<
  AdminUserRow[]
> {
  try {
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
    return data.map(toUserRow);
  } catch (error) {
    console.error("Admin users list failed:", error);
    return [];
  }
});

export const getAdminUser = cache(async function getAdminUser(
  id: string,
): Promise<AdminUserDetail | null> {
  try {
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
    return { ...toUserRow(data), registrations };
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
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("registrations")
        .select(
          "id, program_id, status, registered_at, programs(id, title, type, status)",
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
                type: string | null;
                status: string | null;
              }
            | {
                id: string;
                title: string | null;
                type: string | null;
                status: string | null;
              }[]
            | null,
        );
        return {
          id: row.id,
          programId: program?.id ?? row.program_id,
          programTitle: program?.title?.trim() || "Program",
          typeLabel: typeLabel(program?.type ?? ""),
          programStatusLabel: statusLabel(program?.status ?? ""),
          status: row.status,
          statusLabel: registrationStatusLabel(row.status),
          registeredAt: formatRegisteredAt(row.registered_at),
        };
      });
    } catch (error) {
      console.error("Admin user registrations failed:", error);
      return [];
    }
  },
);
