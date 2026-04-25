import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/connect";
import Admin from "../../../../models/Admin";

export async function GET() {
  try {
    await connectMongoDB();

    const exists = await Admin.findOne({
      username: "admin",
    });

    if (exists) {
      return NextResponse.json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashed,
    });

    return NextResponse.json({
      success: true,
      message: "Admin created",
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Error",
    });
  }
}