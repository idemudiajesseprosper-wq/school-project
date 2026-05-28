import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectMongoDB }
from "../../../../../../lib/connect";

import User
from "../../../../../../models/User";

import { logActivity }
from "../../../../../../lib/logActivity";

export async function DELETE(
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

    if (!id) {

      return NextResponse.json({
        success: false,
        message:
          "Student ID is required",
      });
    }

    const student =
      await User.findById(id);

    if (!student) {

      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    // ALREADY DELETED
    if (student.isDeleted) {

      return NextResponse.json({
        success: false,
        message:
          "Student already deleted",
      });
    }

    // SOFT DELETE
    student.isDeleted = true;

    student.deletedAt =
      new Date();

    student.isOnline = false;

    await student.save();

    // LOG ACTIVITY
    await logActivity({
      userId: decoded.id,
      action: "DELETE_STUDENT",
      target: student.fullName,
    });

    return NextResponse.json({
      success: true,
      message:
        "Student deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}

