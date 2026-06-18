import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../../lib/authUser";
import { ENROLLMENT_FEE_KOBO } from "../../../../../lib/enrollment";
import {
  baseEmail,
  sendEnrollmentEmail,
} from "../../../../../lib/enrollmentEmail";
import Application from "../../../../../models/Application";
import PaymentReceipt from "../../../../../models/PaymentReceipt";
import User from "../../../../../models/User";

export async function POST(req) {
  const auth = await getAuthUser(req, ["applicant"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const { reference } = await req.json();
  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Payment reference is required." },
      { status: 400 },
    );
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Paystack is not configured." },
      { status: 500 },
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  const data = await response.json();
  const tx = data.data;

  if (!response.ok || !data.status || tx?.status !== "success") {
    return NextResponse.json(
      {
        success: false,
        message: data.message || "Payment verification failed.",
      },
      { status: 400 },
    );
  }

  if (tx.amount !== ENROLLMENT_FEE_KOBO || tx.currency !== "NGN") {
    return NextResponse.json(
      { success: false, message: "Payment amount mismatch." },
      { status: 400 },
    );
  }

  if (tx.customer?.email?.toLowerCase() !== auth.user.email.toLowerCase()) {
    return NextResponse.json(
      { success: false, message: "Payment does not belong to this applicant." },
      { status: 403 },
    );
  }

  const paidAt = tx.paid_at ? new Date(tx.paid_at) : new Date();

  await Promise.all([
    User.findByIdAndUpdate(auth.user._id, {
      paymentStatus: "paid",
      paystackReference: reference,
      paymentDate: paidAt,
    }),
    Application.findOneAndUpdate(
      { applicant: auth.user._id },
      {
        paymentStatus: "paid",
        paystackReference: reference,
      },
    ),
    PaymentReceipt.findOneAndUpdate(
      { paystackReference: reference },
      {
        applicant: auth.user._id,
        applicantId: auth.user.applicantId,
        fullName: auth.user.fullName,
        email: auth.user.email,
        amount: ENROLLMENT_FEE_KOBO,
        currency: "NGN",
        paystackReference: reference,
        paidAt,
        channel: tx.channel || "",
      },
      { upsert: true, new: true },
    ),
  ]);

  await sendEnrollmentEmail({
    to: auth.user.email,
    subject: "Enrollment Payment Successful",
    html: baseEmail(
      "Payment Successful",
      `<p>Dear <strong>${auth.user.fullName}</strong>, your enrollment fee payment of <strong>NGN 6,000</strong> has been confirmed.</p><p>Your applicant dashboard has been updated.</p>`,
    ),
  });

  return NextResponse.json({
    success: true,
    message: "Payment verified successfully.",
  });
}
