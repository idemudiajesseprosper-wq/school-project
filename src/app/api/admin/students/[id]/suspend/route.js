import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../../../lib/connect";
import {
  baseEmail,
  sendEnrollmentEmail,
} from "../../../../../../lib/enrollmentEmail";
import { logActivity } from "../../../../../../lib/logActivity";
import User from "../../../../../../models/User";

export async function PATCH(req, context) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    await connectMongoDB();

    const { id } = await context.params;
    const student = await User.findById(id);

    if (!student) {
      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    student.isSuspended = !student.isSuspended;

    if (student.isSuspended) {
      student.suspensionReason = "Violation";
      student.suspendedAt = new Date();
    } else {
      student.suspensionReason = "";
      student.suspendedAt = null;
    }

    await student.save();

    await logActivity({
      userId: decoded.id,
      action: student.isSuspended ? "SUSPEND_STUDENT" : "UNSUSPEND_STUDENT",
      target: student.fullName,
    });

    try {
      if (student.email) {
        await sendEnrollmentEmail({
          to: student.email,
          subject: student.isSuspended
            ? "Student Portal Account Suspended"
            : "Student Portal Account Unsuspended",
          html: baseEmail(
            student.isSuspended ? "Account Suspended" : "Account Unsuspended",
            student.isSuspended
              ? `<p>Dear <strong>${student.fullName}</strong>, your student portal account has been suspended.</p><p>Please contact the school office for more information.</p>`
              : `<p>Dear <strong>${student.fullName}</strong>, your student portal account has been restored.</p><p>You can now log in to the student portal again.</p>`,
          ),
        });
      }
    } catch (emailError) {
      console.log("STUDENT SUSPENSION EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: student.isSuspended
        ? "Student suspended"
        : "Student unsuspended",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
