import Activity from "@/models/Activity";
import connectDB from "@/lib/connect";

export async function logActivity({
  userId,
  userName,
  action,
  target,
  ipAddress,
  metadata = {},
}) {
  try {
    await connectDB();

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