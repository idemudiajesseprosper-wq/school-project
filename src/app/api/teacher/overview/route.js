import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { classQueryValues, normalizeClassList } from "../../../../lib/classes";
import Assignment from "../../../../models/Assignment";
import Notification from "../../../../models/Notification";
import Submission from "../../../../models/Submission";
import Timetable from "../../../../models/Timetable";
import User from "../../../../models/User";

function cleanClasses(classes = []) {
  return normalizeClassList(classes);
}

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const teacher = auth.user;
  const assignedClasses = cleanClasses(teacher.assignedClasses);
  const assignedClassValues = classQueryValues(assignedClasses);
  const teacherData =
    typeof teacher.toObject === "function" ? teacher.toObject() : teacher;

  const [students, assignments, notices, timetables] = await Promise.all([
    User.find({
      role: "student",
      studentClass: { $in: assignedClassValues },
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
    Notification.find({
      teacherId: teacher._id,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
    Timetable.find({ class: { $in: assignedClassValues } }).lean(),
  ]);

  const assignmentIds = assignments.map((assignment) => assignment._id);
  const submissions = assignmentIds.length
    ? await Submission.find({ assignmentId: { $in: assignmentIds } })
        .populate({
          path: "assignmentId",
          select: "title subject teacherId classes deadline",
        })
        .sort({ createdAt: -1 })
        .limit(200)
        .lean()
    : [];

  return NextResponse.json({
    success: true,
    teacher: {
      ...teacherData,
      assignedClasses,
      classTeacherClasses: cleanClasses(teacher.classTeacherClasses || []),
    },
    students,
    assignments,
    submissions,
    notices,
    timetables,
  });
}
