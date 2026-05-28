import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { connectMongoDB }
from "../../../../lib/connect";

import Activity
from "../../../../models/Activity";

export async function GET(req) {

  try {

    const token =
      req.cookies.get("auth_token")?.value;

    if (!token) {

      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {

      return NextResponse.json({
        success: false,
        message: "Access denied",
      });
    }

    await connectMongoDB();

    const activities =
      await Activity.find()
        .sort({ createdAt: -1 })
        .limit(100);

    return NextResponse.json({
      success: true,
      activities,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}

