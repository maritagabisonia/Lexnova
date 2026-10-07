import { getTranslations } from "next-intl/server";
import { FIELD_MAX } from "@/lib/form-input";

export type FaqFormValues = {
  id?: string;
  question: string;
  question_ka: string;
  answer: string;
  answer_ka: string;
  created_at: string | null;
  updated_at: string | null;
};

export const emptyFaqFormValues: FaqFormValues = {
  question: "",
  question_ka: "",
  answer: "",
  answer_ka: "",
  created_at: null,
  updated_at: null,
};

function emptyToNull(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type FaqWritePayload = {
  question: string | null;
  question_ka: string | null;
  answer: string | null;
  answer_ka: string | null;
};

export async function parseFaqForm(
  formData: FormData,
): Promise<{ data: FaqWritePayload } | { error: string }> {
  const t = await getTranslations("admin.errors");
  const fields = await getTranslations("admin.form");
  const question = String(formData.get("question") ?? "").trim();
  const questionKa = String(formData.get("question_ka") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const answerKa = String(formData.get("answer_ka") ?? "").trim();

  if (!question && !questionKa) {
    return { error: t("enterQuestion") };
  }
  if (!answer && !answerKa) {
    return { error: t("enterAnswer") };
  }
  if (question.length > FIELD_MAX.shortText) {
    return { error: t("tooLong", { field: fields("question") }) };
  }
  if (questionKa.length > FIELD_MAX.shortText) {
    return { error: t("tooLong", { field: fields("question") }) };
  }
  if (answer.length > FIELD_MAX.longText) {
    return { error: t("tooLong", { field: fields("answer") }) };
  }
  if (answerKa.length > FIELD_MAX.longText) {
    return { error: t("tooLong", { field: fields("answer") }) };
  }

  return {
    data: {
      question: emptyToNull(question),
      question_ka: emptyToNull(questionKa),
      answer: emptyToNull(answer),
      answer_ka: emptyToNull(answerKa),
    },
  };
}

export async function faqWriteErrorMessage(
  error: { code?: string; message?: string } | null,
) {
  const t = await getTranslations("admin.errors");
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();
  if (code === "23514" || message.includes("check constraint")) {
    return t("checkFaq");
  }
  return t("saveFaq");
}
