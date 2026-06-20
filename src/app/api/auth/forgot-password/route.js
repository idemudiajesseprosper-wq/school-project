import crypto from "node:crypto";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../lib/connect";
import {
  getRequestBaseUrl,
  sendPasswordResetEmail,
} from "../../../../lib/email";
import User from "../../../../models/User";

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    const rawIdentifier = String(email || "").trim();
    const identifier = rawIdentifier.toLowerCase();

    if (!identifier) {
      return NextResponse.json({
        success: false,
        message: "Enter your email or username.",
      });
    }

    await connectMongoDB();

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: rawIdentifier },
        { username: identifier },
      ],
      isDeleted: { $ne: true },
    });

    if (user?.email) {
      const token = crypto.randomBytes(32).toString("hex");

      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            passwordResetTokenHash: tokenHash(token),
            passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000),
          },
        },
      );

      await sendPasswordResetEmail(
        user.email,
        user.fullName || user.username,
        token,
        getRequestBaseUrl(req),
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account matches that email or username, a reset link has been sent.",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD API ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
