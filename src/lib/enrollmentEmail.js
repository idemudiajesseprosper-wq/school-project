import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM ||
  "Winners' Foundation School <onboarding@resend.dev>";

export async function sendEnrollmentEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY || !to) return;
  await resend.emails.send({ from: FROM, to, subject, html });
}

export function baseEmail(title, body) {
  return `
    <div style="font-family:Arial,sans-serif;background:#fff5f5;padding:32px 16px;">
      <div style="max-width:560px;margin:0 auto;background:white;border:1px solid #fee2e2;border-radius:14px;padding:28px;">
        <div style="border-bottom:3px solid #dc2626;padding-bottom:14px;margin-bottom:20px;">
          <h1 style="margin:0;color:#991b1b;font-size:22px;">Winners' Foundation School</h1>
          <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">Enrollment Portal</p>
        </div>
        <h2 style="color:#111827;font-size:20px;margin:0 0 12px;">${title}</h2>
        <div style="color:#374151;font-size:15px;line-height:1.7;">${body}</div>
      </div>
    </div>
  `;
}
