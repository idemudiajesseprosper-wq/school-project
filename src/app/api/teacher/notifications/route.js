import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { normalizeClassList } from "../../../../lib/classes";
import Notification from "../../../../models/Notification";

export async function POST(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const body = await req.json();
  const classes = normalizeClassList(
    Array.isArray(body.classes) ? body.classes : [],
  );
  const allowedClasses = normalizeClassList(auth.user.assignedClasses || []);
  const invalidClass = classes.find(
    (className) => !allowedClasses.includes(className),
  );

  if (!body.title || !body.message || !classes.length) {
    return NextResponse.json({
      success: false,
      message: "Title, message, and class are required",
    });
  }

  if (invalidClass) {
    return NextResponse.json(
      {
        success: false,
        message: `You are not assigned to ${invalidClass}`,
      },
      { status: 403 },
    );
  }

  const notice = await Notification.create({
    title: body.title.trim(),
    message: body.message.trim(),
    classes,
    teacherId: auth.user._id,
    teacherName: auth.user.fullName,
  });

  return NextResponse.json({ success: true, notice });
}
