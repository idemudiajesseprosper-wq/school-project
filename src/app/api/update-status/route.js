import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../lib/authUser";
import { connectMongoDB } from "../../../lib/connect";
import { generateStudentIdNumber } from "../../../lib/enrollment";
import { baseEmail, sendEnrollmentEmail } from "../../../lib/enrollmentEmail";
import Application from "../../../models/Application";
import User from "../../../models/User";

export async function POST(req) {
  const auth = await getAuthUser(req, ["admin"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  try {
    await connectMongoDB();

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 },
      );
    }

    const allowed = ["Pending", "Approved", "Rejected"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 },
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    let studentIdNumber = application.studentIdNumber;

    if (status === "Approved" && !studentIdNumber) {
      studentIdNumber = await generateStudentIdNumber();
    }

    application.status = status;
    application.reviewedAt = new Date();
    if (studentIdNumber) application.studentIdNumber = studentIdNumber;
    await application.save();

    if (application.applicant) {
      const userUpdate = {
        applicationStatus:
          status === "Approved"
            ? "accepted"
            : status === "Rejected"
              ? "rejected"
              : "submitted",
      };

      if (status === "Approved") {
        userUpdate.role = "student";
        userUpdate.studentIdNumber = studentIdNumber;
        userUpdate.admissionNumber = studentIdNumber;
        userUpdate.studentClass = application.classApplying || "";
        userUpdate.fullName = application.fullName || "";
        userUpdate.avatar = application.passport || "";
        userUpdate.phoneNumber = application.phone || "";
        userUpdate.parentName = application.parentName || "";
        userUpdate.parentPhone = application.parentPhone || "";
      }

      await User.findByIdAndUpdate(application.applicant, userUpdate);
    }

    try {
      if (application.email) {
        if (status === "Approved") {
          await sendEnrollmentEmail({
            to: application.email,
            subject: "Application Approved",
            html: baseEmail(
              "Application Approved",
              `<p>Congratulations <strong>${application.fullName}</strong>. Your application has been accepted.</p><p>Your Student ID Number is <strong>${studentIdNumber}</strong>.</p><p>You can now log in through the student portal using your existing password.</p>`,
            ),
          });
        }

        if (status === "Rejected") {
          await sendEnrollmentEmail({
            to: application.email,
            subject: "Application Update",
            html: baseEmail(
              "Application Rejected",
              `<p>Dear <strong>${application.fullName}</strong>, thank you for applying. Your application was not approved at this time.</p>`,
            ),
          });
        }
      }
    } catch (emailError) {
      console.log("APPLICATION STATUS EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      application: application.toObject(),
      studentIdNumber,
    });
  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
