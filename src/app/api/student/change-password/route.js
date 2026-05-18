import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function PATCH(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectMongoDB();

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // CHECK CURRENT PASSWORD
    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" });
    }

    // HASH AND SAVE NEW PASSWORD
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    await user.save();

    return NextResponse.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}