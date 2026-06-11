import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM =
  process.env.RESEND_FROM ||
  "Winners' Foundation School <onboarding@resend.dev>";

const FALLBACK_BASE_URL = "https://winnersfoundationschool.com";

function cleanBaseUrl(value) {
  if (!value) return "";

  const trimmed = value.trim().replace(/\/+$/, "");
  try {
    const url = new URL(trimmed);
    return url.origin;
  } catch {
    return "";
  }
}

function getConfiguredBaseUrl() {
  return (
    cleanBaseUrl(process.env.NEXT_PUBLIC_BASE_URL) ||
    cleanBaseUrl(process.env.NEXTAUTH_URL) ||
    cleanBaseUrl(process.env.APP_BASE_URL) ||
    FALLBACK_BASE_URL
  );
}

export function getRequestBaseUrl(req) {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  const host = forwardedHost || req.headers.get("host");
  const requestBaseUrl = cleanBaseUrl(
    host ? `${forwardedProto}://${host}` : "",
  );

  if (requestBaseUrl && !requestBaseUrl.includes("localhost")) {
    return requestBaseUrl;
  }

  return getConfiguredBaseUrl();
}

export async function sendVerificationEmail(email, fullName, token, baseUrl) {
  if (!process.env.RESEND_API_KEY) return;

  const verifyUrl = `${cleanBaseUrl(baseUrl) || getConfiguredBaseUrl()}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify Your Email – Winners' Foundation School",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f9fafb; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; border: 1px solid #e5e7eb;">
          
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #2563EB, #1d4ed8); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; color: white;">
              W
            </div>
            <h1 style="font-size: 20px; font-weight: 900; color: #0a0a0a; margin: 16px 0 4px;">
              Winners' Foundation School
            </h1>
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Student Portal</p>
          </div>

          <h2 style="font-size: 22px; font-weight: 800; color: #0a0a0a; margin: 0 0 12px;">
            Verify your email address
          </h2>

          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 8px;">
            Hi <strong>${fullName}</strong>,
          </p>

          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
            Thanks for registering. Click the button below to verify your email address and activate your student account.
          </p>

          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${verifyUrl}" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px;">
              Verify Email Address
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #2563EB; font-size: 12px; word-break: break-all; margin: 0 0 28px;">
            ${verifyUrl}
          </p>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.
            </p>
          </div>

        </div>
      </div>
    `,
  });
}
