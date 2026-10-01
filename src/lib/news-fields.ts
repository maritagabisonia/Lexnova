import { getTranslations } from "next-intl/server";
import { FIELD_MAX, isHttpUrl, isUuid } from "@/lib/form-input";
import { localizedText } from "@/lib/localized-content";
import { slugify } from "@/lib/slug";

export type RelatedProgramOption = {
  id: string;
  title: string;
};

export type RelatedProgramRecord = {
  id: string;
  title: string | null;
  title_ka: string | null;
};

export function mapRelatedProgramOptions(
  rows: RelatedProgramRecord[],
  locale: string,
): RelatedProgramOption[] {
  return rows
    .map((row) => ({
      id: row.id,
      title: localizedText(locale, row.title_ka, row.title) ?? "",
    }))
    .sort((a, b) => a.title.localeCompare(b.title, locale, { sensitivity: "base" }));
}

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

export async function parseNewsForm(
  formData: FormData,
): Promise<{ data: NewsWritePayload } | { error: string }> {
  const t = await getTranslations("admin.errors");
  const fields = await getTranslations("admin.form");
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
    return { error: t("enterTitle") };
  }
  if (title.length > FIELD_MAX.title) {
    return { error: t("tooLong", { field: fields("title") }) };
  }
  if (!slug) {
    return { error: t("enterSlug") };
  }
  if (coverUrl && !isHttpUrl(coverUrl)) {
    return { error: t("coverUrl") };
  }
  if (coverUrl && coverUrl.length > FIELD_MAX.url) {
    return { error: t("tooLong", { field: fields("coverImageUrl") }) };
  }
  if (relatedProgramId && !isUuid(relatedProgramId)) {
    return { error: t("validRelatedProgram") };
  }

  const shortDescription = emptyToNull(String(formData.get("short_description") ?? ""));
  const content = emptyToNull(String(formData.get("content") ?? ""));
  const author = emptyToNull(String(formData.get("author") ?? ""));
  if (shortDescription && shortDescription.length > FIELD_MAX.shortText) {
    return { error: t("tooLong", { field: fields("shortDescription") }) };
  }
  if (content && content.length > FIELD_MAX.longText) {
    return { error: t("tooLong", { field: fields("content") }) };
  }
  if (author && author.length > FIELD_MAX.name) {
    return { error: t("tooLong", { field: fields("author") }) };
  }

  let publishedAt: string | null = null;
  if (publishedAtRaw) {
    const parsed = new Date(publishedAtRaw);
    if (Number.isNaN(parsed.getTime())) {
      return { error: t("validPublishedDate") };
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
      short_description: shortDescription,
      content,
      author,
      related_program_id: relatedProgramId,
      published,
      published_at: publishedAt,
    },
  };
}

export async function newsWriteErrorMessage(
  error: { code?: string; message?: string } | null,
) {
  const t = await getTranslations("admin.errors");
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23505" || message.includes("news_articles_slug")) {
    return t("slugTaken");
  }
  if (code === "23503" || message.includes("related_program")) {
    return t("validRelatedProgram");
  }
  return t("saveArticle");
}
