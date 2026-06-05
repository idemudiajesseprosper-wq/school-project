import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../lib/authUser";
import { connectMongoDB } from "../../../lib/connect";
import Application from "../../../models/Application";
import User from "../../../models/User";

export async function GET(req) {
  const auth = await getAuthUser(req, ["admin"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  try {
    await connectMongoDB();

    const page = Math.max(Number(req.nextUrl.searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.nextUrl.searchParams.get("limit")) || 50, 1),
      100,
    );
    const skip = (page - 1) * limit;

    const [
      applications,
      totalApplications,
      totalApplicants,
      paidApplicants,
      pendingApplications,
      acceptedApplications,
      rejectedApplications,
    ] = await Promise.all([
      Application.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Application.countDocuments(),
      User.countDocuments({ role: "applicant", isDeleted: { $ne: true } }),
      User.countDocuments({
        role: "applicant",
        paymentStatus: "paid",
        isDeleted: { $ne: true },
      }),
      Application.countDocuments({
        $or: [{ status: { $exists: false } }, { status: "Pending" }],
      }),
      Application.countDocuments({ status: "Approved" }),
      Application.countDocuments({ status: "Rejected" }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total: totalApplications,
        pages: Math.ceil(totalApplications / limit),
      },
      stats: {
        totalApplicants,
        paidApplicants,
        unpaidApplicants: Math.max(totalApplicants - paidApplicants, 0),
        submittedApplications: pendingApplications,
        acceptedApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return NextResponse.json(
      { applications: [], error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
