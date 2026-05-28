import Activity from "../models/Activity";
import { connectMongoDB } from "./connect";

export async function logActivity({
  userId,
  userName,
  action,
  target,
  ipAddress,
  metadata = {},
}) {
  try {
    await connectMongoDB();

    await Activity.create({
      userId,
      userName,
      action,
      target,
      ipAddress,
      metadata,
    });

  } catch (error) {
    console.log("Activity log failed:", error.message);
  }
}