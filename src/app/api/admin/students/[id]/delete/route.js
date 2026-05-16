import { NextResponse }
from "next/server";

import { connectMongoDB }
from "../../../../../../lib/connect";

import User
from "../../../../../../models/User";

export async function DELETE(req) {

  try {

    const { studentId } =
      await req.json();

    await connectMongoDB();

    await User.findByIdAndDelete(
      studentId
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}