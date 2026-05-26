import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "../../../../lib/connect";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    console.log("LOGIN REQUEST STARTED");

    const { email, username, password, role } = await req.json();

    console.log("REQUEST BODY:", { email, username, role });

    await connectMongoDB();

    console.log("MONGODB CONNECTED");

    let user;

    // ADMIN LOGIN
    if (role === "admin") {
      console.log("ADMIN LOGIN ATTEMPT");
      user = await User.findOne({ username });
    }

    // STUDENT LOGIN
    else {
      console.log("STUDENT LOGIN ATTEMPT");
      user = await User.findOne({ email, isDeleted: { $ne: true } });
    }

    console.log("USER FOUND:", user);

    // USER NOT FOUND
    if (!user) {
      console.log("ERROR: USER NOT FOUND");
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ROLE CHECK
    if (user.role !== role) {
      console.log("ERROR: ROLE MISMATCH", { expected: role, actual: user.role });
      return NextResponse.json({
        success: false,
        message: "Unauthorized role",
      });
    }

    // BLOCK SUSPENDED USERS
    if (user.isSuspended) {
      return NextResponse.json({
        success: false,
        message: "Your account has been suspended. Contact the school office.",
      });
    }

    // PASSWORD CHECK
    const validPassword = await bcrypt.compare(password, user.password);

    console.log("PASSWORD VALID:", validPassword);

    if (!validPassword) {
      console.log("ERROR: INVALID PASSWORD");
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // GET IP ADDRESS
    const ip = req.headers.get("x-forwarded-for") || "Unknown";

    // GET DEVICE
    const device = req.headers.get("user-agent") || "Unknown Device";

    console.log("LOGIN DEVICE:", device);
    console.log("LOGIN IP:", ip);

    // UPDATE USER ACTIVITY
    user.lastLogin = new Date();
    user.loginCount += 1;
    user.isOnline = true;

    // SAVE LOGIN HISTORY
    user.loginHistory.push({ time: new Date(), ip, device });

    // KEEP ONLY LAST 20 LOGINS
    if (user.loginHistory.length > 20) {
      user.loginHistory = user.loginHistory.slice(-20);
    }

    await user.save();

    console.log("USER LOGIN INFO SAVED");

    // CREATE JWT TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("TOKEN CREATED");

    // RESPONSE
    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    // SET AUTH COOKIE
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("COOKIE SET SUCCESSFULLY");
    console.log("LOGIN SUCCESSFUL");

    return response;

  } catch (error) {
    console.log("LOGIN API ERROR:", error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}