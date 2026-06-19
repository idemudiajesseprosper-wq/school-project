import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/connect";
import Code from "../../../models/Code";

function generateCode() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WFS-${new Date().getFullYear()}-${random}`;
}

export async function POST() {
  try {
    await connectMongoDB();

    const newCode = generateCode();

    const code = await Code.create({
      code: newCode,
    });

    return NextResponse.json({ code: code.code });
  } catch (error) {
    console.log("ERROR:", error);
    return NextResponse.json({ error: error.message });
  }
}

// ✅ ADD THIS (so browser can access it)
export async function GET() {
  return POST();
}
