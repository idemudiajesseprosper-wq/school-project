import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function GET(req) {
  try {
    await connectMongoDB();

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

    const page = Math.max(Number(req.nextUrl.searchParams.get("page")) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.nextUrl.searchParams.get("limit")) || 50, 1),
      100,
    );
    const skip = (page - 1) * limit;
    const filters = {
      role: "student",
      isDeleted: { $ne: true },
    };

    const [students, total] = await Promise.all([
      User.find(filters)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filters),
    ]);

    return NextResponse.json({
      success: true,
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
