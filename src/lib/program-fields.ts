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
  slug: string;
  short_description: string;
  full_description: string;
  target_audience: string;
  objectives: string;
  learning_outcomes: string;
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
  slug: "",
  short_description: "",
  full_description: "",
  target_audience: "",
  objectives: "",
  learning_outcomes: "",
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
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  target_audience: string | null;
  objectives: string | null;
  learning_outcomes: string | null;
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

export function parseProgramForm(
  formData: FormData,
): { data: ProgramWritePayload } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const type = String(formData.get("type") ?? "");
  const format = String(formData.get("format") ?? "");
  const status = String(formData.get("status") ?? "");
  const lecturerId = String(formData.get("lecturer_id") ?? "").trim();

  if (!title) {
    return { error: "Please enter a title." };
  }
  if (!slug) {
    return { error: "Please enter a slug." };
  }
  if (type !== "course" && type !== "training") {
    return { error: "Please choose Course or Training." };
  }
  if (format !== "online" && format !== "in_person" && format !== "hybrid") {
    return { error: "Please choose a format." };
  }
  if (!programStatusOptions.some((option) => option.value === status)) {
    return { error: "Please choose a status." };
  }
  if (!lecturerId) {
    return { error: "Please choose a lecturer." };
  }

  const maxRaw = emptyToNull(String(formData.get("max_participants") ?? ""));
  let maxParticipants: number | null = null;
  if (maxRaw) {
    const parsed = Number.parseInt(maxRaw, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return { error: "Max participants must be a positive whole number." };
    }
    maxParticipants = parsed;
  }

  const priceRaw = emptyToNull(String(formData.get("price") ?? ""));
  let price: number | null = null;
  if (priceRaw) {
    const parsed = Number.parseFloat(priceRaw);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return { error: "Price must be zero or a positive amount." };
    }
    price = parsed;
  }

  return {
    data: {
      type,
      title,
      slug,
      short_description: emptyToNull(String(formData.get("short_description") ?? "")),
      full_description: emptyToNull(String(formData.get("full_description") ?? "")),
      target_audience: emptyToNull(String(formData.get("target_audience") ?? "")),
      objectives: emptyToNull(String(formData.get("objectives") ?? "")),
      learning_outcomes: emptyToNull(String(formData.get("learning_outcomes") ?? "")),
      duration_text: emptyToNull(String(formData.get("duration_text") ?? "")),
      start_date: emptyToNull(String(formData.get("start_date") ?? "")),
      end_date: emptyToNull(String(formData.get("end_date") ?? "")),
      registration_deadline: emptyToNull(
        String(formData.get("registration_deadline") ?? ""),
      ),
      format,
      location: emptyToNull(String(formData.get("location") ?? "")),
      lecturer_id: lecturerId,
      max_participants: maxParticipants,
      status,
      price,
    },
  };
}

export function programWriteErrorMessage(error: { code?: string; message?: string } | null) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23505" || message.includes("programs_slug")) {
    return "That slug is already in use. Please choose another.";
  }
  if (code === "23503" || message.includes("lecturer")) {
    return "Please choose a valid lecturer.";
  }
  if (code === "23514" || message.includes("check constraint")) {
    return "Please check the program details and try again.";
  }
  return "We could not save this program. Please try again.";
}
