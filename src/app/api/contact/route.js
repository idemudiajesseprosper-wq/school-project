import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_FROM ||
  "Winners' Foundation School <onboarding@resend.dev>";

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function extractEmailAddress(value) {
  const match = String(value || "").match(/<([^>]+)>/);
  return match?.[1] || value;
}

export async function POST(req) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Email service is not configured." },
        { status: 500 },
      );
    }

    const { firstName, lastName, phone, email, audience, subject, message } =
      await req.json();

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !subject?.trim() ||
      !message?.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    const senderName = `${firstName.trim()} ${lastName.trim()}`;
    const contactEmail = String(email || "").trim();
    const to =
      process.env.CONTACT_TO || extractEmailAddress(process.env.RESEND_FROM);

    await resend.emails.send({
      from: FROM,
      to,
      replyTo: contactEmail || undefined,
      subject: `Website Contact: ${subject.trim()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #111827;">
          <h2 style="margin: 0 0 16px; color: #1d4ed8;">New Website Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(senderName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(contactEmail || "Not provided")}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
          <p><strong>I am a:</strong> ${escapeHtml(audience || "Not selected")}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
            <p style="white-space: pre-line; margin: 0; line-height: 1.6;">${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.log("CONTACT FORM ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message." },
      { status: 500 },
    );
  }
}
