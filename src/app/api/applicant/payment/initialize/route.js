import { NextResponse } from "next/server";

import { requireApplicantEmailVerification } from "../../../../../lib/applicantVerification";
import { getAuthUser, unauthorized } from "../../../../../lib/authUser";
import { ENROLLMENT_FEE_KOBO } from "../../../../../lib/enrollment";

export async function POST(req) {
  const auth = await getAuthUser(req, ["applicant"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  if (requireApplicantEmailVerification() && !auth.user.isVerified) {
    return NextResponse.json(
      { success: false, message: "Please verify your email before payment." },
      { status: 403 },
    );
  }

  if (auth.user.paymentStatus === "paid") {
    return NextResponse.json(
      { success: false, message: "Enrollment fee has already been paid." },
      { status: 409 },
    );
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Paystack is not configured." },
      { status: 500 },
    );
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: auth.user.email,
        amount: ENROLLMENT_FEE_KOBO,
        currency: "NGN",
        callback_url: `${origin}/applicant/payment-success`,
        metadata: {
          applicantId: auth.user.applicantId,
          userId: String(auth.user._id),
        },
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || !data.status) {
    return NextResponse.json(
      { success: false, message: data.message || "Could not start payment." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  });
}
