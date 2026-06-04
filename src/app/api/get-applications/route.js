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

    const [applications, applicantUsers] = await Promise.all([
      Application.find().sort({ createdAt: -1 }),
      User.find({ role: "applicant", isDeleted: { $ne: true } })
        .select("paymentStatus applicationStatus")
        .lean(),
    ]);

    return NextResponse.json({
      applications,
      stats: {
        totalApplicants: applicantUsers.length,
        paidApplicants: applicantUsers.filter(
          (user) => user.paymentStatus === "paid",
        ).length,
        unpaidApplicants: applicantUsers.filter(
          (user) => user.paymentStatus !== "paid",
        ).length,
        submittedApplications: applications.filter(
          (app) => !app.status || app.status === "Pending",
        ).length,
        acceptedApplications: applications.filter(
          (app) => app.status === "Approved",
        ).length,
        rejectedApplications: applications.filter(
          (app) => app.status === "Rejected",
        ).length,
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
