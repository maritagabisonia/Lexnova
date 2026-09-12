import { slugify } from "@/lib/slug";

export type RelatedProgramOption = {
  id: string;
  title: string;
};

export type NewsFormValues = {
  id?: string;
  title: string;
  slug: string;
  cover_image_url: string;
  short_description: string;
  content: string;
  author: string;
  related_program_id: string;
  published: boolean;
  published_at: string;
  created_at: string | null;
};

export const emptyNewsFormValues: NewsFormValues = {
  title: "",
  slug: "",
  cover_image_url: "",
  short_description: "",
  content: "",
  author: "",
  related_program_id: "",
  published: false,
  published_at: "",
  created_at: null,
};

export function toDateTimeLocal(value: string | null | undefined) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }
  return date.toISOString().slice(0, 16);
}

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type NewsWritePayload = {
  title: string;
  slug: string;
  cover_image_url: string | null;
  short_description: string | null;
  content: string | null;
  author: string | null;
  related_program_id: string | null;
  published: boolean;
  published_at: string | null;
};

export function parseNewsForm(
  formData: FormData,
): { data: NewsWritePayload } | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const published = String(formData.get("published") ?? "") === "true";
  const coverUrl = emptyToNull(String(formData.get("cover_image_url") ?? ""));
  const relatedProgramId = emptyToNull(
    String(formData.get("related_program_id") ?? ""),
  );
  const publishedAtRaw = emptyToNull(String(formData.get("published_at") ?? ""));

  if (!title) {
    return { error: "Please enter a title." };
  }
  if (!slug) {
    return { error: "Please enter a slug." };
  }
  if (coverUrl && !/^https?:\/\//i.test(coverUrl)) {
    return { error: "Cover image URL must start with http:// or https://." };
  }

  let publishedAt: string | null = null;
  if (publishedAtRaw) {
    const parsed = new Date(publishedAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "Please enter a valid published date." };
    }
    publishedAt = parsed.toISOString();
  } else if (published) {
    publishedAt = new Date().toISOString();
  }

  return {
    data: {
      title,
      slug,
      cover_image_url: coverUrl,
      short_description: emptyToNull(String(formData.get("short_description") ?? "")),
      content: emptyToNull(String(formData.get("content") ?? "")),
      author: emptyToNull(String(formData.get("author") ?? "")),
      related_program_id: relatedProgramId,
      published,
      published_at: publishedAt,
    },
  };
}

export function newsWriteErrorMessage(error: { code?: string; message?: string } | null) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23505" || message.includes("news_articles_slug")) {
    return "That slug is already in use. Please choose another.";
  }
  if (code === "23503" || message.includes("related_program")) {
    return "Please choose a valid related program.";
  }
  return "We could not save this article. Please try again.";
}
