import { cache } from "react";
import { getLocale } from "next-intl/server";
import { localizedText } from "@/lib/localized-content";
import { createClient } from "@/lib/supabase/server";

export type PublicFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const getPublicFaqItems = cache(async function getPublicFaqItems(): Promise<
  PublicFaqItem[]
> {
  try {
    const locale = await getLocale();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faq_items")
      .select("id, question, question_ka, answer, answer_ka")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data) {
      if (error) {
        console.error("Public FAQ list failed:", error);
      }
      return [];
    }
    return data
      .map((row) => {
        const question = localizedText(locale, row.question_ka, row.question);
        const answer = localizedText(locale, row.answer_ka, row.answer);
        if (!question || !answer) {
          return null;
        }
        return { id: row.id, question, answer };
      })
      .filter((row): row is PublicFaqItem => row !== null);
  } catch (error) {
    console.error("Public FAQ list failed:", error);
    return [];
  }
});
