import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "../../../../../lib/connect";
import User from "../../../../../models/User";

export async function POST(req) {
  try {
    const {
      email,
      username,
      password,
      role,
    } = await req.json();

    await connectMongoDB();

    let user;

    // ADMIN LOGIN
    if (role === "admin") {
      user = await User.findOne({
        username,
      });
    }

    // STUDENT LOGIN
    else {
      user = await User.findOne({
        email,
      });
    }

    // USER NOT FOUND
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ROLE CHECK
    if (user.role !== role) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized role",
      });
    }

    // PASSWORD CHECK
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GET IP ADDRESS
    const ip =
      req.headers.get("x-forwarded-for") ||
      "Unknown";

    // GET DEVICE
    const device =
      req.headers.get("user-agent") ||
      "Unknown Device";

    // UPDATE USER ACTIVITY
    user.lastLogin = new Date();

    user.loginCount += 1;

    user.isOnline = true;

    // SAVE LOGIN HISTORY
    user.loginHistory.push({
      time: new Date(),
      ip,
      device,
    });

    // KEEP ONLY LAST 20 LOGINS
    if (user.loginHistory.length > 20) {
      user.loginHistory =
        user.loginHistory.slice(-20);
    }

    await user.save();

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // RESPONSE
    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    // SET AUTH COOKIE
    response.cookies.set(
      "auth_token",
      token,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return response;

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}