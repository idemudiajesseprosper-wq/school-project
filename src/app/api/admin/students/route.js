import { NextResponse }
from "next/server";

import jwt from "jsonwebtoken";

import { connectMongoDB }
from "../../../../../lib/connect";

import User
from "../../../../../models/User";

export async function GET(req) {
  try {
    await connectMongoDB();

    // GET TOKEN
    const token =
      req.cookies.get("auth_token")
      ?.value;

    // NO TOKEN
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // CHECK ADMIN
    if (decoded.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    // GET STUDENTS
    const students =
      await User.find({
        role: "student",
      })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      students,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}