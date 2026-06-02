import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Assignment from "../../../../models/Assignment";
import Notification from "../../../../models/Notification";
import Submission from "../../../../models/Submission";
import Timetable from "../../../../models/Timetable";
import User from "../../../../models/User";

function cleanClasses(classes = []) {
  return classes.filter(Boolean);
}

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const teacher = auth.user;
  const assignedClasses = cleanClasses(teacher.assignedClasses);

  const [students, assignments, submissions, notices, timetables] =
    await Promise.all([
      User.find({
        role: "student",
        studentClass: { $in: assignedClasses },
        isDeleted: { $ne: true },
      })
        .select("fullName email studentClass admissionNumber phoneNumber")
        .sort({ studentClass: 1, fullName: 1 })
        .lean(),
      Assignment.find({
        teacherId: teacher._id,
        isDeleted: { $ne: true },
      })
        .sort({ createdAt: -1 })
        .lean(),
      Submission.find({})
        .populate({
          path: "assignmentId",
          select: "title subject teacherId classes deadline",
          match: { teacherId: teacher._id, isDeleted: { $ne: true } },
        })
        .sort({ createdAt: -1 })
        .lean(),
      Notification.find({
        teacherId: teacher._id,
        isDeleted: { $ne: true },
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Timetable.find({ class: { $in: assignedClasses } }).lean(),
    ]);

  return NextResponse.json({
    success: true,
    teacher,
    students,
    assignments,
    submissions: submissions.filter((item) => item.assignmentId),
    notices,
    timetables,
  });
}
