import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../../lib/connect";

import Activity from "../../../../models/Activity";

function mapActivityType(action = "") {
  const normalized = action.toLowerCase();
  if (normalized.includes("failed")) return "failed_login";
  if (normalized.includes("logout")) return "logout";
  if (normalized.includes("register") || normalized.includes("application"))
    return "register";
  if (normalized.includes("password")) return "password";
  if (normalized.includes("login")) return "login";
  return "admin";
}

function formatActivity(activity) {
  const metadata = activity.metadata || {};
  return {
    _id: String(activity._id),
    type: mapActivityType(activity.action),
    fullName: activity.userName,
    role: metadata.role,
    email: activity.target,
    ip: activity.ipAddress,
    device: metadata.device || metadata.userAgent || "Unknown device",
    location: metadata.location,
    browser: metadata.browser,
    time: activity.createdAt,
    action: activity.action,
    alertType: metadata.alertType,
    metadata,
  };
}

export async function GET(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    await connectMongoDB();

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      activities: activities.map(formatActivity),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
