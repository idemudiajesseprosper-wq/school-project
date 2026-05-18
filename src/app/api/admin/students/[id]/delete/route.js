import { NextResponse }
from "next/server";

import { connectMongoDB }
from "../../../../../lib/connect";

import User
from "../../../../../models/User";

export async function DELETE(
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

    await User.findByIdAndDelete(id);

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