import { NextResponse } from "next/server";

import { verifyAdmin } from "../../../../lib/adminAuth";
import { CLASS_OPTIONS } from "../../../../lib/classes";
import { connectMongoDB } from "../../../../lib/connect";
import Notification from "../../../../models/Notification";

export async function POST(req) {
  try {
    verifyAdmin(req);
    await connectMongoDB();

    const body = await req.json();
    const title = String(body.title || "").trim();
    const message = String(body.message || "").trim();

    if (!title || !message) {
      return NextResponse.json(
        { success: false, message: "Title and message are required" },
        { status: 400 },
      );
    }

    const notice = await Notification.create({
      title,
      message,
      classes: CLASS_OPTIONS,
      teacherName: "School Admin",
    });

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    console.log("ADMIN NOTIFICATION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to send announcement" },
      { status: 500 },
    );
  }
}
