import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/connect";
import Code from "../../../models/Code";

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
  } catch (_error) {
    return NextResponse.json({
      success: false,
      codes: [],
    });
  }
}
