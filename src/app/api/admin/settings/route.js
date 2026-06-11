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
    const settingsObject = settings.toObject();

    return NextResponse.json({
      success: true,
      settings: {
        ...settingsObject,
        requireEmailVerification: settingsObject.requireVerification,
      },
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

    const requireVerification =
      body.requireEmailVerification ?? body.requireVerification ?? true;

    if (!settings) {
      settings = await Settings.create({
        ...body,
        requireVerification,
      });
    } else {
      settings.schoolName = body.schoolName;
      settings.supportEmail = body.supportEmail;
      settings.allowRegistration = body.allowRegistration;
      settings.requireVerification = requireVerification;
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
