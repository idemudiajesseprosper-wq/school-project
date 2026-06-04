import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { connectMongoDB } from "../../../../lib/connect";
import { generateApplicantId } from "../../../../lib/enrollment";
import { sendVerificationEmail } from "../../../../lib/email";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already exists." },
        { status: 409 }
      );
    }

    const applicantId = await generateApplicantId();
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "applicant",
      applicantId,
      paymentStatus: "unpaid",
      applicationStatus: "not_started",
      isVerified: false,
      verificationToken,
    });

    await sendVerificationEmail(normalizedEmail, fullName.trim(), verificationToken);

    return NextResponse.json({
      success: true,
      applicantId,
      message: "Applicant account created. Please verify your email.",
    });
  } catch (error) {
    console.log("APPLICANT REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
