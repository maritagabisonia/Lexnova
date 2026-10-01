import { Resend } from "resend";
import { site } from "@/lib/site";

const FROM = `${site.name} <onboarding@resend.dev>`;

function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return false;
  }

  const name = oneLine(input.name);
  const email = oneLine(input.email);
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    input.message,
  ].join("\n");
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p>`,
  ].join("");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: site.email,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: body,
      html,
    });

    if (error) {
      console.error("Contact email failed:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Contact email failed:", error);
    return false;
  }
}
