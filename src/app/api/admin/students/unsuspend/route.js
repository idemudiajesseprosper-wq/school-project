import { NextResponse } from "next/server";

import { connectMongoDB }
from "../../../../../lib/connect";

import User
from "../../../../../models/User";

export async function POST(req) {

  try {

    const { studentId } =
      await req.json();

    await connectMongoDB();

    const student =
      await User.findById(studentId);

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

    return NextResponse.json({
      success: true,
      message:
        "Student unsuspended",
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}