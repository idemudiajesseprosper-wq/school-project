import { connectMongoDB } from "../../../../lib/connect";
import Code from "../../../../models/Code";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { code } = await req.json();

    // Basic validation
    if (!code) {
      return NextResponse.json({
        valid: false,
        message: "Code is required",
      });
    }

    await connectMongoDB();

    const found = await Code.findOne({
      code: code.trim(),
    });

    // ❌ Not found
    if (!found) {
      return NextResponse.json({
        valid: false,
        message: "Invalid access code",
      });
    }

    // ❌ Already used
    if (found.used) {
      return NextResponse.json({
        valid: false,
        message: "This code has already been used",
      });
    }

    // ✅ Valid
    return NextResponse.json({
      valid: true,
      message: "Code verified successfully",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      valid: false,
      message: "Server error",
    });
  }
}