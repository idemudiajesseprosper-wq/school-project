import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../lib/authUser";
import { connectMongoDB } from "../../../lib/connect";
import Application from "../../../models/Application";

export async function GET(req) {
  const auth = await getAuthUser(req, ["admin"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const student = await Application.findById(id).lean();
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        student,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.log("GET SINGLE APPLICATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
