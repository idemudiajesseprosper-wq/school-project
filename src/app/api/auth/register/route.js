import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";
import { sendVerificationEmail } from "../../../../lib/email";

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // GENERATE VERIFICATION TOKEN
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "student",
      isVerified: false,
      verificationToken,
    });

    // SEND VERIFICATION EMAIL
    await sendVerificationEmail(email, fullName, verificationToken);

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}