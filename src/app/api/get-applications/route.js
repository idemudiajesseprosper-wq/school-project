import { connectMongoDB } from "../../../lib/connect";
import Application from "../../../models/Application";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();

    const applications = await Application.find().sort({ createdAt: -1 });

    return NextResponse.json({
      applications,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return NextResponse.json(
      { applications: [], error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}