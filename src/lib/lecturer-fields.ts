export type LecturerFormValues = {
  id?: string;
  full_name: string;
  title: string;
  photo_url: string;
  bio: string;
  created_at: string | null;
};

export const emptyLecturerFormValues: LecturerFormValues = {
  full_name: "",
  title: "",
  photo_url: "",
  bio: "",
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
};

export function parseLecturerForm(
  formData: FormData,
): { data: LecturerWritePayload } | { error: string } {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const title = emptyToNull(String(formData.get("title") ?? ""));
  const photoUrl = emptyToNull(String(formData.get("photo_url") ?? ""));
  const bio = emptyToNull(String(formData.get("bio") ?? ""));

  if (!fullName) {
    return { error: "Please enter a name." };
  }
  if (photoUrl && !/^https?:\/\//i.test(photoUrl)) {
    return { error: "Photo URL must start with http:// or https://." };
  }

  return {
    data: {
      full_name: fullName,
      title,
      photo_url: photoUrl,
      bio,
    },
  };
}

export function lecturerWriteErrorMessage(error: { code?: string; message?: string } | null) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23514" || message.includes("check constraint")) {
    return "Please check the lecturer details and try again.";
  }
  return "We could not save this lecturer. Please try again.";
}
