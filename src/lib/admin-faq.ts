import { cache } from "react";
import { getLocale } from "next-intl/server";
import { formatAdminDateTime } from "@/lib/admin-format";
import { type FaqFormValues } from "@/lib/faq-fields";
import { localizedText } from "@/lib/localized-content";
import { createClient } from "@/lib/supabase/server";

export type { FaqFormValues } from "@/lib/faq-fields";
export { emptyFaqFormValues } from "@/lib/faq-fields";

export type AdminFaqRow = {
  id: string;
  question: string;
  questionKa: string;
  questionEn: string;
  sortOrder: number;
};

function formatTimestamp(value: string | null, locale: string) {
  if (!value) {
    return null;
  }
  return formatAdminDateTime(value, locale);
}

function textOrEmpty(value: string | null | undefined) {
  return value ?? "";
}

export const getAdminFaqRows = cache(async function getAdminFaqRows(): Promise<
  AdminFaqRow[]
> {
  try {
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("id, question, question_ka, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) {
      if (error) {
        console.error("Admin FAQ list failed:", error);
      }
      return [];
    }
    return data.map((row) => ({
      id: row.id,
      question: localizedText(locale, row.question_ka, row.question) ?? "",
      questionKa: textOrEmpty(row.question_ka),
      questionEn: textOrEmpty(row.question),
      sortOrder: row.sort_order,
    }));
  } catch (error) {
    console.error("Admin FAQ list failed:", error);
    return [];
  }
});

export const getAdminFaq = cache(async function getAdminFaq(
  id: string,
): Promise<FaqFormValues | null> {
  try {
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select(
        "id, question, question_ka, answer, answer_ka, created_at, updated_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (error || !data) {
      return null;
    }
    return {
      id: data.id,
      question: textOrEmpty(data.question),
      question_ka: textOrEmpty(data.question_ka),
      answer: textOrEmpty(data.answer),
      answer_ka: textOrEmpty(data.answer_ka),
      created_at: formatTimestamp(data.created_at ?? null, locale),
      updated_at: formatTimestamp(data.updated_at ?? null, locale),
    };
  } catch {
    return null;
  }
});
