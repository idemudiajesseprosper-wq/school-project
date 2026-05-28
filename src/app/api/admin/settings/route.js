import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/connect";
import Settings from "../../../../models/Settings";

export async function GET() {
  try {
    await connectMongoDB();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
}

export async function PATCH(req) {
  try {
    await connectMongoDB();

    const body = await req.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
    } else {
      settings.schoolName = body.schoolName;
      settings.supportEmail = body.supportEmail;
      settings.allowRegistration = body.allowRegistration;
      settings.maintenanceMode = body.maintenanceMode;
      settings.maxLoginAttempts = body.maxLoginAttempts;

      await settings.save();
    }

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Failed to update settings",
    });
  }
}

