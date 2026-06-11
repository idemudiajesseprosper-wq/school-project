import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../../../lib/connect";
import {
  baseEmail,
  sendEnrollmentEmail,
} from "../../../../../../lib/enrollmentEmail";
import User from "../../../../../../models/User";

export async function POST(req) {
  try {
    const { studentId } = await req.json();

    await connectMongoDB();

    const student = await User.findById(studentId);

    if (!student) {
      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    student.isSuspended = false;
    student.suspensionReason = "";
    student.suspendedAt = null;

    await student.save();

    try {
      if (student.email) {
        await sendEnrollmentEmail({
          to: student.email,
          subject: "Student Portal Account Unsuspended",
          html: baseEmail(
            "Account Unsuspended",
            `<p>Dear <strong>${student.fullName}</strong>, your student portal account has been restored.</p><p>You can now log in to the student portal again.</p>`,
          ),
        });
      }
    } catch (emailError) {
      console.log("STUDENT UNSUSPEND EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Student unsuspended",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
