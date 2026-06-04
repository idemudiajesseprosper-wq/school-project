import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
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

    const { fullName, phoneNumber, studentClass, avatar } = await req.json();

    if (!fullName?.trim()) {
      return NextResponse.json({
        success: false,
        message: "Full name is required",
      });
    }

    await User.findByIdAndUpdate(decoded.id, {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber?.trim() || "",
      studentClass: studentClass || "",
      avatar: avatar || "",
    });

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
