import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Application from "../../../../models/Application";
import PaymentReceipt from "../../../../models/PaymentReceipt";

export async function GET(req) {
  const auth = await getAuthUser(req, ["applicant", "student"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const [application, receipt] = await Promise.all([
    Application.findOne({ applicant: auth.user._id }).sort({ createdAt: -1 }).lean(),
    PaymentReceipt.findOne({ applicant: auth.user._id }).sort({ paidAt: -1 }).lean(),
  ]);

  return NextResponse.json({
    success: true,
    applicant: auth.user,
    application,
    receipt,
  });
}
