import { NextResponse } from "next/server";

import { connectMongoDB }
from "../../../../../lib/connect";

import User
from "../../../../../models/User";

export async function POST(req) {

  try {

    const {
      studentId,
      reason,
    } = await req.json();

    await connectMongoDB();

    const student =
      await User.findById(studentId);

    if (!student) {

      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    student.isSuspended = true;

    student.suspensionReason =
      reason || "Violation";

    student.suspendedAt =
      new Date();

    await student.save();

    return NextResponse.json({
      success: true,
      message:
        "Student suspended successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}