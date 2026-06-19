import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../lib/connect";

import User from "../../../../models/User";

export async function GET(req) {
  try {
    await connectMongoDB();

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

    // FIND USER
    const user = await User.findById(decoded.id).select("-password");

    // USER NOT FOUND
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // SUCCESS
    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
