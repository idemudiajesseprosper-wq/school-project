import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../lib/connect";
import User from "../../../models/User";

export async function GET() {
  try {
    await connectMongoDB();

    const hashed = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { username: "admin" },
      {
        fullName: "Main Admin",
        username: "admin",
        email: "admin@school.com",
        password: hashed,
        role: "admin",
        isVerified: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Admin ready",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error creating admin",
    });
  }
}