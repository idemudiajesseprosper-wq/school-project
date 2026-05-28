import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { connectMongoDB }
from "../../../../lib/connect";

import User
from "../../../../models/User";

import { logActivity }
from "../../../../lib/logActivity";

export async function POST(req) {

  try {

    console.log("LOGIN REQUEST STARTED");

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
        isDeleted: { $ne: true },
      });
    }

    // USER NOT FOUND
    if (!user) {

      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ACCOUNT LOCK CHECK
    if (
      user.accountLockedUntil &&
      user.accountLockedUntil > Date.now()
    ) {

      return NextResponse.json({
        success: false,
        message:
          "Account locked. Try again later.",
      });
    }

    // ROLE CHECK
    if (user.role !== role) {

      return NextResponse.json({
        success: false,
        message: "Unauthorized role",
      });
    }

    // BLOCK SUSPENDED USERS
    if (user.isSuspended) {

      return NextResponse.json({
        success: false,
        message:
          "Your account has been suspended.",
      });
    }

    // PASSWORD CHECK
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    // INVALID PASSWORD
    if (!validPassword) {

      user.failedLoginAttempts += 1;

      // LOCK ACCOUNT
      if (user.failedLoginAttempts >= 5) {

        user.accountLockedUntil =
          Date.now() + 15 * 60 * 1000;

        await logActivity({
          userId: user._id,
          userName: user.fullName,
          action: "ACCOUNT_LOCKED",
          target: user.email,
        });
      }

      await user.save();

      await logActivity({
        userId: user._id,
        userName: user.fullName,
        action: "FAILED_LOGIN",
        target: user.email,
      });

      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GET IP
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

    user.failedLoginAttempts = 0;

    user.accountLockedUntil = null;

    // SAVE LOGIN HISTORY
    user.loginHistory.push({
      time: new Date(),
      ip,
      device,
    });

    // KEEP LAST 20 LOGINS
    if (user.loginHistory.length > 20) {

      user.loginHistory =
        user.loginHistory.slice(-20);
    }

    await user.save();

    // LOG ACTIVITY
    await logActivity({
      userId: user._id,
      userName: user.fullName,
      action: "LOGIN",
      target: user.email,
      ipAddress: ip,
      metadata: {
        device,
        role: user.role,
      },
    });

    // CREATE JWT
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

    const response =
      NextResponse.json({
        success: true,
        role: user.role,
      });

    // SET COOKIE
    response.cookies.set(
      "auth_token",
      token,
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return response;

  } catch (error) {

    console.log(
      "LOGIN API ERROR:",
      error
    );

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}

