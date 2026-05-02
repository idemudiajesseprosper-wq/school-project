import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../../lib/connect";
import User from "../../../../../models/User";

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

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "student",
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}