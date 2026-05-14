import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    await connectMongoDB();

    // GET TOKEN
    const token =
      req.cookies.get("auth_token")?.value;

    // IF TOKEN EXISTS
    if (token) {
      try {
        // VERIFY TOKEN
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );

        // FIND USER
        const user =
          await User.findById(decoded.id);

        // SET USER OFFLINE
        if (user) {
          user.isOnline = false;

          await user.save();
        }

      } catch (error) {
        console.log(error);
      }
    }

    // CREATE RESPONSE
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // REMOVE COOKIE
    response.cookies.set(
      "auth_token",
      "",
      {
        httpOnly: true,

        expires: new Date(0),

        path: "/",
      }
    );

    return response;

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Logout failed",
    });
  }
}