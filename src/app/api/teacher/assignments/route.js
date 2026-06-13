import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { normalizeClassList } from "../../../../lib/classes";
import Assignment from "../../../../models/Assignment";

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const assignments = await Assignment.find({
    teacherId: auth.user._id,
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({ success: true, assignments });
}

export async function POST(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const body = await req.json();
  const classes = normalizeClassList(toArray(body.classes));
  const allowedClasses = normalizeClassList(auth.user.assignedClasses || []);
  const allowedSubjects = Array.from(
    new Set(
      [auth.user.subject, ...(auth.user.assignedSubjects || [])]
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    ),
  );
  const subject = String(body.subject || "").trim();
  const invalidClass = classes.find(
    (className) => !allowedClasses.includes(className),
  );

  if (
    !body.title ||
    !body.description ||
    !subject ||
    !body.deadline ||
    !classes.length
  ) {
    return NextResponse.json({
      success: false,
      message: "Title, description, subject, deadline, and class are required",
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

  if (!allowedSubjects.includes(subject)) {
    return NextResponse.json(
      {
        success: false,
        message: `You are not assigned to teach ${subject}`,
      },
      { status: 403 },
    );
  }

  const assignment = await Assignment.create({
    title: body.title.trim(),
    description: body.description.trim(),
    subject,
    classes,
    teacherId: auth.user._id,
    teacherName: auth.user.fullName,
    fileUrl: body.fileUrl || "",
    fileName: body.fileName || "",
    deadline: new Date(body.deadline),
  });

  return NextResponse.json({ success: true, assignment });
}
