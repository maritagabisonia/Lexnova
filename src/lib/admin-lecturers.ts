import { cache } from "react";
import { getLocale } from "next-intl/server";
import { formatAdminDateTime } from "@/lib/admin-format";
import {
  type LecturerFormValues,
} from "@/lib/lecturer-fields";
import { createClient } from "@/lib/supabase/server";

export type { LecturerFormValues } from "@/lib/lecturer-fields";
export { emptyLecturerFormValues } from "@/lib/lecturer-fields";

export type AdminLecturerRow = {
  id: string;
  fullName: string;
  title: string | null;
  photoUrl: string | null;
};

function formatTimestamp(value: string | null, locale: string) {
  if (!value) {
    return null;
  }
  return formatAdminDateTime(value, locale);
}

export const getAdminLecturerRows = cache(async function getAdminLecturerRows(): Promise<
  AdminLecturerRow[]
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lecturers")
      .select("id, full_name, title, photo_url")
      .order("full_name", { ascending: true });
    if (error || !data) {
      if (error) {
        console.error("Admin lecturers list failed:", error);
      }
      return [];
    }
    return data.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      title: row.title,
      photoUrl: row.photo_url,
    }));
  } catch (error) {
    console.error("Admin lecturers list failed:", error);
    return [];
  }
});

export const getAdminLecturer = cache(async function getAdminLecturer(
  id: string,
): Promise<LecturerFormValues | null> {
  try {
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lecturers")
      .select("id, full_name, title, photo_url, bio, created_at")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return null;
    }
    return {
      id: data.id,
      full_name: data.full_name ?? "",
      title: data.title ?? "",
      photo_url: data.photo_url ?? "",
      bio: data.bio ?? "",
      created_at: formatTimestamp(data.created_at ?? null, locale),
    };
  } catch {
    return null;
  }
});
