import jwt from "jsonwebtoken";
import User from "../models/User";
import { connectMongoDB } from "./connect";

export async function getAuthUser(req, allowedRoles = []) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectMongoDB();

    const user = await User.findOne({
      _id: decoded.id,
      isDeleted: { $ne: true },
    }).select("-password");

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      return { error: "Forbidden", status: 403 };
    }

    return { user };
  } catch (error) {
    console.log("AUTH USER ERROR:", error);
    return { error: "Invalid session", status: 401 };
  }
}

export function unauthorized(message = "Unauthorized", status = 401) {
  return Response.json({ success: false, message }, { status });
}
