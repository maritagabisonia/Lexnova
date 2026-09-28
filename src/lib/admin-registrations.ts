import { cache } from "react";
import { getLocale } from "next-intl/server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { createClient } from "@/lib/supabase/server";

export type AdminRegistrationRow = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  registeredAt: string;
};

export type StudentSearchResult = {
  id: string;
  name: string;
  email: string;
};

function asOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) {
    return null;
  }
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function formatRegisteredAt(value: string | null, locale = "en") {
  if (!value) {
    return "—";
  }
  return formatAdminDateTime(value, locale);
}

export const getAdminProgramRegistrations = cache(
  async function getAdminProgramRegistrations(
    programId: string,
  ): Promise<AdminRegistrationRow[]> {
    try {
      const locale = await getLocale();
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("registrations")
        .select("id, student_id, registered_at, profiles(full_name, email)")
        .eq("program_id", programId)
        .eq("status", "confirmed")
        .order("registered_at", { ascending: true });

      if (error || !data) {
        if (error) {
          console.error("Admin program registrations failed:", error);
        }
        return [];
      }

      return data.map((row) => {
        const profile = asOne(
          row.profiles as
            | { full_name: string | null; email: string | null }
            | { full_name: string | null; email: string | null }[]
            | null,
        );
        return {
          id: row.id,
          studentId: row.student_id,
          name: profile?.full_name?.trim() || "Student",
          email: profile?.email?.trim() || "—",
          registeredAt: formatRegisteredAt(row.registered_at, locale),
        };
      });
    } catch (error) {
      console.error("Admin program registrations failed:", error);
      return [];
    }
  },
);

export function sanitizeStudentSearch(query: string) {
  return query
    .replace(/[%_*,.()"'\\:;]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}
