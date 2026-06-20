import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    const resetToken = String(token || "").trim();
    const newPassword = String(password || "");

    if (!resetToken || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    await connectMongoDB();

    const user = await User.findOne({
      passwordResetTokenHash: tokenHash(resetToken),
      passwordResetExpires: { $gt: new Date() },
      isDeleted: { $ne: true },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "This reset link is invalid or has expired.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.accountLockedUntil = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.log("RESET PASSWORD API ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
