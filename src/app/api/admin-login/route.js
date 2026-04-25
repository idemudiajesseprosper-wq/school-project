import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/connect";
import Admin from "../../../../models/Admin";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    await connectMongoDB();

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const valid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!valid) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}