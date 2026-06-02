import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Notification from "../../../../models/Notification";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const notices = await Notification.find({
    classes: auth.user.studentClass,
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    notices,
    studentClass: auth.user.studentClass,
  });
}
