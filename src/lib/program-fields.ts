import { getTranslations } from "next-intl/server";
import { FIELD_MAX, isIsoDate, isUuid } from "@/lib/form-input";
import { slugify } from "@/lib/slug";

export const programStatusOptions = [
  { value: "coming_soon", label: "Coming soon" },
  { value: "registration_open", label: "Registration open" },
  { value: "fully_booked", label: "Fully booked" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export const programFormatOptions = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
] as const;

export type AdminLecturerOption = {
  id: string;
  fullName: string;
  title?: string | null;
};

export type ProgramFormValues = {
  id?: string;
  type: "course" | "training";
  title: string;
  title_ka: string;
  slug: string;
  short_description: string;
  short_description_ka: string;
  full_description: string;
  full_description_ka: string;
  target_audience: string;
  target_audience_ka: string;
  objectives: string;
  objectives_ka: string;
  learning_outcomes: string;
  learning_outcomes_ka: string;
  duration_text: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  format: "online" | "in_person" | "hybrid";
  location: string;
  lecturer_id: string;
  max_participants: string;
  status: string;
  price: string;
  created_at: string | null;
  updated_at: string | null;
};

export const emptyProgramFormValues: ProgramFormValues = {
  type: "course",
  title: "",
  title_ka: "",
  slug: "",
  short_description: "",
  short_description_ka: "",
  full_description: "",
  full_description_ka: "",
  target_audience: "",
  target_audience_ka: "",
  objectives: "",
  objectives_ka: "",
  learning_outcomes: "",
  learning_outcomes_ka: "",
  duration_text: "",
  start_date: "",
  end_date: "",
  registration_deadline: "",
  format: "online",
  location: "",
  lecturer_id: "",
  max_participants: "",
  status: "coming_soon",
  price: "",
  created_at: null,
  updated_at: null,
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type ProgramWritePayload = {
  type: "course" | "training";
  title: string | null;
  title_ka: string | null;
  slug: string;
  short_description: string | null;
  short_description_ka: string | null;
  full_description: string | null;
  full_description_ka: string | null;
  target_audience: string | null;
  target_audience_ka: string | null;
  objectives: string | null;
  objectives_ka: string | null;
  learning_outcomes: string | null;
  learning_outcomes_ka: string | null;
  duration_text: string | null;
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  format: "online" | "in_person" | "hybrid";
  location: string | null;
  lecturer_id: string;
  max_participants: number | null;
  status: string;
  price: number | null;
};

export async function parseProgramForm(
  formData: FormData,
): Promise<{ data: ProgramWritePayload } | { error: string }> {
  const t = await getTranslations("admin.errors");
  const fields = await getTranslations("admin.form");
  const title = emptyToNull(String(formData.get("title") ?? ""));
  const titleKa = emptyToNull(String(formData.get("title_ka") ?? ""));
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title || "");
  const type = String(formData.get("type") ?? "");
  const format = String(formData.get("format") ?? "");
  const status = String(formData.get("status") ?? "");
  const lecturerId = String(formData.get("lecturer_id") ?? "").trim();

  if (!title && !titleKa) {
    return { error: t("enterTitle") };
  }
  if (title && title.length > FIELD_MAX.title) {
    return { error: t("tooLong", { field: fields("title") }) };
  }
  if (titleKa && titleKa.length > FIELD_MAX.title) {
    return { error: t("tooLong", { field: fields("title") }) };
  }
  if (!slug) {
    return { error: t("enterSlug") };
  }
  if (type !== "course" && type !== "training") {
    return { error: t("chooseType") };
  }
  if (format !== "online" && format !== "in_person" && format !== "hybrid") {
    return { error: t("chooseFormat") };
  }
  if (!programStatusOptions.some((option) => option.value === status)) {
    return { error: t("chooseStatus") };
  }
  if (!isUuid(lecturerId)) {
    return { error: t("chooseLecturer") };
  }

  const startDate = emptyToNull(String(formData.get("start_date") ?? ""));
  const endDate = emptyToNull(String(formData.get("end_date") ?? ""));
  const deadline = emptyToNull(String(formData.get("registration_deadline") ?? ""));
  if (startDate && !isIsoDate(startDate)) {
    return { error: t("validStartDate") };
  }
  if (endDate && !isIsoDate(endDate)) {
    return { error: t("validEndDate") };
  }
  if (deadline && !isIsoDate(deadline)) {
    return { error: t("validDeadline") };
  }

  const shortDescription = emptyToNull(String(formData.get("short_description") ?? ""));
  const shortDescriptionKa = emptyToNull(
    String(formData.get("short_description_ka") ?? ""),
  );
  const fullDescription = emptyToNull(String(formData.get("full_description") ?? ""));
  const fullDescriptionKa = emptyToNull(
    String(formData.get("full_description_ka") ?? ""),
  );
  const targetAudience = emptyToNull(String(formData.get("target_audience") ?? ""));
  const targetAudienceKa = emptyToNull(
    String(formData.get("target_audience_ka") ?? ""),
  );
  const objectives = emptyToNull(String(formData.get("objectives") ?? ""));
  const objectivesKa = emptyToNull(String(formData.get("objectives_ka") ?? ""));
  const learningOutcomes = emptyToNull(String(formData.get("learning_outcomes") ?? ""));
  const learningOutcomesKa = emptyToNull(
    String(formData.get("learning_outcomes_ka") ?? ""),
  );
  const durationText = emptyToNull(String(formData.get("duration_text") ?? ""));
  const location = emptyToNull(String(formData.get("location") ?? ""));

  for (const [value, field, max] of [
    [shortDescription, "shortDescription", FIELD_MAX.shortText],
    [shortDescriptionKa, "shortDescription", FIELD_MAX.shortText],
    [fullDescription, "fullDescription", FIELD_MAX.longText],
    [fullDescriptionKa, "fullDescription", FIELD_MAX.longText],
    [targetAudience, "targetAudience", FIELD_MAX.longText],
    [targetAudienceKa, "targetAudience", FIELD_MAX.longText],
    [objectives, "objectives", FIELD_MAX.longText],
    [objectivesKa, "objectives", FIELD_MAX.longText],
    [learningOutcomes, "learningOutcomes", FIELD_MAX.longText],
    [learningOutcomesKa, "learningOutcomes", FIELD_MAX.longText],
    [durationText, "duration", FIELD_MAX.shortText],
    [location, "location", FIELD_MAX.shortText],
  ] as const) {
    if (value && value.length > max) {
      return { error: t("tooLong", { field: fields(field) }) };
    }
  }

  const maxRaw = emptyToNull(String(formData.get("max_participants") ?? ""));
  let maxParticipants: number | null = null;
  if (maxRaw) {
    const parsed = Number.parseInt(maxRaw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { error: t("maxParticipants") };
    }
    maxParticipants = parsed;
  }

  const priceRaw = emptyToNull(String(formData.get("price") ?? ""));
  let price: number | null = null;
  if (priceRaw) {
    const parsed = Number.parseFloat(priceRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: t("price") };
    }
    price = parsed;
  }

  return {
    data: {
      type,
      title,
      title_ka: titleKa,
      slug,
      short_description: shortDescription,
      short_description_ka: shortDescriptionKa,
      full_description: fullDescription,
      full_description_ka: fullDescriptionKa,
      target_audience: targetAudience,
      target_audience_ka: targetAudienceKa,
      objectives: objectives,
      objectives_ka: objectivesKa,
      learning_outcomes: learningOutcomes,
      learning_outcomes_ka: learningOutcomesKa,
      duration_text: durationText,
      start_date: startDate,
      end_date: endDate,
      registration_deadline: deadline,
      format,
      location,
      lecturer_id: lecturerId,
      max_participants: maxParticipants,
      status,
      price,
    },
  };
}

export async function programWriteErrorMessage(
  error: { code?: string; message?: string } | null,
) {
  const t = await getTranslations("admin.errors");
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23505" || message.includes("programs_slug")) {
    return t("slugTaken");
  }
  if (code === "23503" || message.includes("lecturer")) {
    return t("validLecturer");
  }
  if (code === "23514" || message.includes("check constraint")) {
    return t("checkProgram");
  }
  return t("saveProgram");
}
