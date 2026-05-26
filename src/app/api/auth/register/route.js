import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const {
      fullName,
      email,
      password,
      dateOfBirth,
      gender,
      studentClass,
      admissionNumber,
      phoneNumber,
      parentName,
      parentPhone,
      parentEmail,
      relationship,
    } = await req.json();

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

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "student",

      // AUTO VERIFIED — re-enable when domain is ready
      isVerified: true,
      verificationToken: null,

      // STUDENT INFO
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      studentClass: studentClass || "",
      admissionNumber: admissionNumber || "",
      phoneNumber: phoneNumber || "",

      // PARENT / GUARDIAN
      parentName: parentName || "",
      parentPhone: parentPhone || "",
      parentEmail: parentEmail || "",
      relationship: relationship || "",
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful. You can now log in.",
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}