import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { requireApplicantEmailVerification } from "../../../../lib/applicantVerification";
import { connectMongoDB } from "../../../../lib/connect";
import { requireEmailVerification } from "../../../../lib/emailVerification";
import { logActivity } from "../../../../lib/logActivity";
import User from "../../../../models/User";

function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function POST(req) {
  try {
    console.log("LOGIN REQUEST STARTED");

    const { email, username, password, role } = await req.json();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedUsername = String(username || "").trim();

    await connectMongoDB();

    let user;

    // ADMIN LOGIN
    if (role === "admin") {
      user = await User.findOne({
        username: normalizedUsername,
        isDeleted: { $ne: true },
      });
    }

    // STUDENT / TEACHER LOGIN
    else {
      user = await User.findOne({
        email: normalizedEmail,
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
    if (user.accountLockedUntil && user.accountLockedUntil > Date.now()) {
      return NextResponse.json({
        success: false,
        message: "Account locked. Try again later.",
      });
    }

    // ROLE CHECK. The student portal login can authenticate students or teachers.
    if (role && user.role !== role) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized role",
      });
    }

    if (!role && !["student", "teacher"].includes(user.role)) {
      return NextResponse.json({
        success: false,
        message: "Use the correct login page for this account.",
      });
    }

    // BLOCK SUSPENDED USERS
    if (user.isSuspended) {
      return NextResponse.json({
        success: false,
        message: "Your account has been suspended.",
      });
    }

    if (
      user.role === "applicant" &&
      requireApplicantEmailVerification() &&
      !user.isVerified
    ) {
      return NextResponse.json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    if (
      ["student", "teacher"].includes(user.role) &&
      (await requireEmailVerification()) &&
      !user.isVerified
    ) {
      return NextResponse.json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    // PASSWORD CHECK
    const validPassword =
      user.password && (await bcrypt.compare(password, user.password));

    // INVALID PASSWORD
    if (!validPassword) {
      const failedLoginAttempts = Number(user.failedLoginAttempts || 0) + 1;
      const userName =
        user.fullName || user.username || user.email || "Unknown user";
      const target =
        user.email || user.username || normalizedEmail || normalizedUsername;

      // LOCK ACCOUNT
      if (failedLoginAttempts >= 5) {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              failedLoginAttempts,
              accountLockedUntil: new Date(Date.now() + 15 * 60 * 1000),
            },
          },
        );

        await logActivity({
          userId: user._id,
          userName,
          action: "ACCOUNT_LOCKED",
          target,
        });
      } else {
        await User.updateOne(
          { _id: user._id },
          {
            $set: {
              failedLoginAttempts,
            },
          },
        );
      }

      await logActivity({
        userId: user._id,
        userName,
        action: "FAILED_LOGIN",
        target,
      });

      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GET IP
    const ip = req.headers.get("x-forwarded-for") || "Unknown";

    // GET DEVICE
    const device = req.headers.get("user-agent") || "Unknown Device";
    const userName =
      user.fullName || user.username || user.email || "Unknown user";
    const target =
      user.email || user.username || normalizedEmail || normalizedUsername;
    const loginHistory = Array.isArray(user.loginHistory)
      ? user.loginHistory
      : [];

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          isOnline: true,
          failedLoginAttempts: 0,
          accountLockedUntil: null,
          loginCount: Number(user.loginCount || 0) + 1,
          loginHistory: [
            ...loginHistory,
            {
              time: new Date(),
              ip,
              device,
            },
          ].slice(-20),
        },
      },
    );

    // LOG ACTIVITY
    await logActivity({
      userId: user._id,
      userName,
      action: "LOGIN",
      target,
      ipAddress: ip,
      metadata: {
        device,
        role: user.role,
      },
    });

    // CREATE JWT
    const token = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    // SET COOKIE
    response.cookies.set("auth_token", token, authCookieOptions());

    return response;
  } catch (error) {
    console.log("LOGIN API ERROR:", error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
