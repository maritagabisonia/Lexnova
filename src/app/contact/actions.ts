"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactActionState = {
  error?: string;
  success?: string;
};

export async function sendContactMessage(
  _prev: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { error: "Please enter your name." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (!message) {
    return { error: "Please enter a message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("Contact form insert failed:", error);
    return {
      error:
        "We could not send your message. Please email us directly and try again later.",
    };
  }

  return { success: "Thanks, we'll be in touch" };
}
