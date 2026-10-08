import { getTranslations } from "next-intl/server";
import { FIELD_MAX, isHttpUrl } from "@/lib/form-input";

export type LecturerFormValues = {
  id?: string;
  full_name: string;
  title: string;
  photo_url: string;
  bio: string;
  show_on_about: boolean;
  created_at: string | null;
};

export const emptyLecturerFormValues: LecturerFormValues = {
  full_name: "",
  title: "",
  photo_url: "",
  bio: "",
  show_on_about: false,
  created_at: null,
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type LecturerWritePayload = {
  full_name: string;
  title: string | null;
  photo_url: string | null;
  bio: string | null;
  show_on_about: boolean;
};

export async function parseLecturerForm(
  formData: FormData,
): Promise<{ data: LecturerWritePayload } | { error: string }> {
  const t = await getTranslations("admin.errors");
  const fields = await getTranslations("admin.form");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const title = emptyToNull(String(formData.get("title") ?? ""));
  const photoUrl = emptyToNull(String(formData.get("photo_url") ?? ""));
  const bio = emptyToNull(String(formData.get("bio") ?? ""));
  const showOnAbout = String(formData.get("show_on_about") ?? "") === "true";

  if (!fullName) {
    return { error: t("enterName") };
  }
  if (fullName.length > FIELD_MAX.name) {
    return { error: t("tooLong", { field: fields("fullName") }) };
  }
  if (title && title.length > FIELD_MAX.title) {
    return { error: t("tooLong", { field: fields("title") }) };
  }
  if (photoUrl && !isHttpUrl(photoUrl)) {
    return { error: t("photoUrl") };
  }
  if (photoUrl && photoUrl.length > FIELD_MAX.url) {
    return { error: t("tooLong", { field: fields("photoUrl") }) };
  }
  if (bio && bio.length > FIELD_MAX.longText) {
    return { error: t("tooLong", { field: fields("bio") }) };
  }

  return {
    data: {
      full_name: fullName,
      title,
      photo_url: photoUrl,
      bio,
      show_on_about: showOnAbout,
    },
  };
}

export async function lecturerWriteErrorMessage(
  error: { code?: string; message?: string } | null,
) {
  const t = await getTranslations("admin.errors");
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23514" || message.includes("check constraint")) {
    return t("checkLecturer");
  }
  return t("saveLecturer");
}
