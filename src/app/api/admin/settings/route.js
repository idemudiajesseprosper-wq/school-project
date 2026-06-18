import mongoose from "mongoose";
import { NextResponse } from "next/server";

import { verifyAdmin } from "../../../../lib/adminAuth";
import { connectMongoDB } from "../../../../lib/connect";
import Settings from "../../../../models/Settings";
import User from "../../../../models/User";

const DEFAULT_SETTINGS = {
  schoolName: "Winners' Foundation School",
  schoolEmail: "wfsonline1999@gmail.com",
  schoolAddress:
    "2, Airhueghiomon street, Osazuwa, Off Etete Road, Enogie, Benin City",
  supportEmail: "wfsonline1999@gmail.com",
  schoolWebsite: "",
  timezone: "Africa/Lagos",
  language: "en",
  academicYear: "2025/2026",
  allowRegistration: true,
  maintenanceMode: false,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  requireVerification: true,
  twoFactorAuth: false,
  passwordMinLength: 8,
  emailNotifications: true,
  smsNotifications: false,
  notifyOnNewStudent: true,
  notifyOnLogin: false,
  notifyOnSystemErrors: true,
  digestFrequency: "daily",
  primaryColor: "#2563eb",
  logoUrl: "/logo.PNG",
  darkMode: false,
  compactView: false,
  showWelcomeMessage: true,
  welcomeMessage: "Welcome back to Winners' Foundation School Portal.",
};

const SETTINGS_FIELDS = Object.keys(DEFAULT_SETTINGS);

function normalizeSettings(body) {
  const next = {};
  for (const field of SETTINGS_FIELDS) {
    if (body[field] !== undefined) next[field] = body[field];
  }
  next.requireVerification =
    body.requireEmailVerification ?? body.requireVerification ?? true;
  return next;
}

export async function GET(req) {
  try {
    verifyAdmin(req);
    await connectMongoDB();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
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
    verifyAdmin(req);
    await connectMongoDB();

    const body = await req.json();

    let settings = await Settings.findOne();
    const nextSettings = normalizeSettings(body);

    if (!settings) {
      settings = await Settings.create({
        ...DEFAULT_SETTINGS,
        ...nextSettings,
      });
    } else {
      settings.set(nextSettings);
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

export async function POST(req) {
  try {
    verifyAdmin(req);
    await connectMongoDB();

    const body = await req.json();
    const action = body.action;

    if (action === "clearSessions") {
      const result = await User.updateMany(
        {},
        {
          $set: {
            isOnline: false,
            lastLogout: new Date(),
          },
        },
      );

      return NextResponse.json({
        success: true,
        message: `Cleared ${result.modifiedCount} active session record(s).`,
      });
    }

    if (action === "resetDefaults") {
      const settings = await Settings.findOneAndUpdate(
        {},
        { $set: DEFAULT_SETTINGS },
        { new: true, upsert: true },
      );

      return NextResponse.json({
        success: true,
        message: "Settings reset to school defaults.",
        settings: {
          ...settings.toObject(),
          requireEmailVerification: settings.requireVerification,
        },
      });
    }

    if (action === "exportArchive") {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      const archive = {};

      for (const collection of collections) {
        archive[collection.name] = await mongoose.connection.db
          .collection(collection.name)
          .find({})
          .toArray();
      }

      return NextResponse.json({
        success: true,
        exportedAt: new Date().toISOString(),
        archive,
      });
    }

    if (action === "deletePortalData") {
      if (body.confirm !== "DELETE") {
        return NextResponse.json(
          { success: false, message: "Type DELETE to confirm." },
          { status: 400 },
        );
      }

      const keepCollections = new Set(["users", "settings"]);
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      const deleted = {};
      for (const collection of collections) {
        if (keepCollections.has(collection.name)) continue;
        const result = await mongoose.connection.db
          .collection(collection.name)
          .deleteMany({});
        deleted[collection.name] = result.deletedCount;
      }

      const userResult = await User.updateMany(
        { role: { $ne: "admin" } },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            isOnline: false,
          },
        },
      );
      deleted.users = userResult.modifiedCount;

      await Settings.findOneAndUpdate(
        {},
        {
          $set: {
            ...DEFAULT_SETTINGS,
            maintenanceMode: true,
          },
        },
        { upsert: true },
      );

      return NextResponse.json({
        success: true,
        message:
          "Portal data deleted. Admin accounts were retained and maintenance mode was enabled.",
        deleted,
      });
    }

    return NextResponse.json(
      { success: false, message: "Unknown settings action." },
      { status: 400 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Failed to run settings action",
    });
  }
}
