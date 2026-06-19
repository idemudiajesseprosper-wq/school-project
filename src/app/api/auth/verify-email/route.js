import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Invalid verification link",
      });
    }

    await connectMongoDB();

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired verification link",
      });
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: false,
        message: "Email already verified",
      });
    }

    // MARK AS VERIFIED
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
