import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";
import { authOptions } from "../[...nextauth]/route";

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

function getSafeCallbackUrl(req, role) {
  const { searchParams } = new URL(req.url);
  const fallback =
    role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/student";
  const callbackUrl = searchParams.get("callbackUrl") || fallback;

  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return fallback;
  }

  if (role === "teacher" && callbackUrl.startsWith("/teacher")) {
    return callbackUrl;
  }

  if (role === "admin" && callbackUrl.startsWith("/admin")) {
    return callbackUrl;
  }

  if (role === "student" && callbackUrl.startsWith("/student")) {
    return callbackUrl;
  }

  return fallback;
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login/student", req.url));
    }

    await connectMongoDB();

    const user = await User.findOne({
      email: session.user.email.toLowerCase(),
      isDeleted: { $ne: true },
    });

    if (
      !user ||
      !["student", "teacher", "admin"].includes(user.role) ||
      user.isSuspended
    ) {
      return NextResponse.redirect(
        new URL("/login/student?error=AccessDenied", req.url),
      );
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          lastLogin: new Date(),
          isOnline: true,
          failedLoginAttempts: 0,
          accountLockedUntil: null,
        },
        $inc: { loginCount: 1 },
        $push: {
          loginHistory: {
            $each: [
              {
                time: new Date(),
                ip: req.headers.get("x-forwarded-for") || "Unknown",
                device: req.headers.get("user-agent") || "Unknown Device",
              },
            ],
            $slice: -20,
          },
        },
      },
    );

    const appToken = jwt.sign(
      {
        id: String(user._id),
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const destination = getSafeCallbackUrl(req, user.role);
    const response = NextResponse.redirect(new URL(destination, req.url));
    response.cookies.set("auth_token", appToken, authCookieOptions());

    return response;
  } catch (error) {
    console.log("GOOGLE SESSION ERROR:", error);
    return NextResponse.redirect(
      new URL("/login/student?error=Google", req.url),
    );
  }
}
