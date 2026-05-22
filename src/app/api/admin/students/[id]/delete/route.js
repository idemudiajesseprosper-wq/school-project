import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "../../../../../../lib/connect";
import User from "../../../../../../models/User";

export async function DELETE(req, context) {
  try {
    // VERIFY ADMIN TOKEN
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied" });
    }

    await connectMongoDB();

    // FIX: get id from URL params not req.json()
    const { id } = await context.params;

    const student = await User.findById(id);

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" });
    }

    // SOFT DELETE
    student.isDeleted = true;
    student.deletedAt = new Date();
    student.isOnline = false;
    await student.save();

    return NextResponse.json({ success: true, message: "Student deleted successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}