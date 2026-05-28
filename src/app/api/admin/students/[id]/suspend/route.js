import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";

import { connectMongoDB }
from "../../../../../../lib/connect";

import User
from "../../../../../../models/User";

import { logActivity }
from "../../../../../../lib/logActivity";

export async function PATCH(
  req,
  context
) {

  try {

    // VERIFY ADMIN TOKEN
    const token =
      req.cookies.get("auth_token")?.value;

    if (!token) {

      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {

      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    await connectMongoDB();

    const { id } =
      await context.params;

    const student =
      await User.findById(id);

    if (!student) {

      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    // TOGGLE SUSPENSION
    student.isSuspended =
      !student.isSuspended;

    // SAVE DETAILS
    if (student.isSuspended) {

      student.suspensionReason =
        "Violation";

      student.suspendedAt =
        new Date();

    } else {

      student.suspensionReason =
        "";

      student.suspendedAt =
        null;
    }

    await student.save();

    // LOG ACTIVITY
    await logActivity({
      userId: decoded.id,

      action:
        student.isSuspended
          ? "SUSPEND_STUDENT"
          : "UNSUSPEND_STUDENT",

      target: student.fullName,
    });

    return NextResponse.json({
      success: true,

      message:
        student.isSuspended
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
