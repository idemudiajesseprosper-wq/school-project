import { NextResponse } from "next/server";

import { connectMongoDB }
from "../../../../../../lib/connect";

import User
from "../../../../../../models/User";

export async function PATCH(
  req,
  context
) {

  try {

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