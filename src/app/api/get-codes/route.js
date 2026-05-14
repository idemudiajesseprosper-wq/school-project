import { connectMongoDB } from "../../../lib/connect";
import Code from "../../../models/Code";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const codes = await Code.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      codes,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      codes: [],
    });
  }
}