import { connectMongoDB } from "../../../../lib/connect";
import Application from "../../../../models/Application";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const student = await Application.findById(id);

  return NextResponse.json({
    success: true,
    student,
  });
}