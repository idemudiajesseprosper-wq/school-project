import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../../lib/connect";

import User from "../../../../../models/User";

export async function GET(req, context) {
  try {
    await connectMongoDB();

    // FIX: await params in Next.js App Router
    const { id } = await context.params;

    // GET TOKEN
    const token = req.cookies.get("auth_token")?.value;

    // NO TOKEN
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CHECK ADMIN
    if (decoded.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    // GET USER
    const student = await User.findById(id).select("-password");

    // NOT FOUND
    if (!student) {
      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
