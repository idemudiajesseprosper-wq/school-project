import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../lib/connect";
import Code from "../../../models/Code";

export async function POST(req) {
  try {
    const { code } = await req.json();
    const cleanCode = code?.trim();

    if (!cleanCode) {
      return NextResponse.json({
        valid: false,
        message: "Code is required",
      });
    }

    await connectMongoDB();

    const usedCode = await Code.findOneAndUpdate(
      {
        code: cleanCode,
        used: false,
      },
      {
        $set: { used: true },
      },
      {
        new: true,
      },
    );

    if (usedCode) {
      return NextResponse.json({
        valid: true,
        message: "Code verified successfully",
      });
    }

    const found = await Code.findOne({ code: cleanCode });

    if (!found) {
      return NextResponse.json({
        valid: false,
        message: "Invalid access code",
      });
    }

    return NextResponse.json({
      valid: false,
      message: "This code has already been used",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      valid: false,
      message: "Server error",
    });
  }
}
