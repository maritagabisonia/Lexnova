"use server";

import { getTranslations } from "next-intl/server";
import { FIELD_MAX, tooLong } from "@/lib/form-input";
import { createClient } from "@/lib/supabase/server";

export type ContactActionState = {
  error?: string;
  success?: string;
};

export async function sendContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const t = await getTranslations("contact.errors");
  const fields = await getTranslations("errors.fields");
  const tooLongT = await getTranslations("errors");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { error: t("name") };
  }
  if (!email || !email.includes("@")) {
    return { error: t("email") };
  }
  if (!message) {
    return { error: t("message") };
  }
  if (tooLong(name, FIELD_MAX.name, "Name")) {
    return { error: tooLongT("tooLong", { field: fields("name") }) };
  }
  if (tooLong(email, FIELD_MAX.email, "Email")) {
    return { error: tooLongT("tooLong", { field: fields("email") }) };
  }
  if (tooLong(message, FIELD_MAX.message, "Message")) {
    return { error: tooLongT("tooLong", { field: fields("message") }) };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("Contact form insert failed:", error);
    return { error: t("generic") };
  }

  const successT = await getTranslations("contact");
  return { success: successT("success") };
}
