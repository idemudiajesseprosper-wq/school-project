import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { classQueryValues, normalizeClassName } from "../../../../lib/classes";
import Notification from "../../../../models/Notification";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const page = Math.max(Number(req.nextUrl.searchParams.get("page")) || 1, 1);
  const limit = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("limit")) || 20, 1),
    100,
  );
  const skip = (page - 1) * limit;
  const studentClass = normalizeClassName(auth.user.studentClass);
  const filters = {
    classes: { $in: classQueryValues([studentClass]) },
    isDeleted: { $ne: true },
  };

  const [notices, total] = await Promise.all([
    Notification.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filters),
  ]);

  return NextResponse.json({
    success: true,
    notices,
    studentClass,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
