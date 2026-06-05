import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Assignment from "../../../../models/Assignment";
import Notification from "../../../../models/Notification";
import Submission from "../../../../models/Submission";
import Timetable from "../../../../models/Timetable";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const studentClass = auth.user.studentClass;
  const [assignments, submissions, notices, timetable] = await Promise.all([
    Assignment.find({
      classes: studentClass,
      isDeleted: { $ne: true },
    })
      .sort({ deadline: 1 })
      .limit(100)
      .lean(),
    Submission.find({ studentId: auth.user._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    Notification.find({
      classes: studentClass,
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Timetable.findOne({ class: studentClass }).lean(),
  ]);

  return NextResponse.json({
    success: true,
    assignments,
    submissions,
    notices,
    timetable,
  });
}

export async function POST(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const body = await req.json();
  const assignment = await Assignment.findOne({
    _id: body.assignmentId,
    classes: auth.user.studentClass,
    isDeleted: { $ne: true },
  });

  if (!assignment) {
    return NextResponse.json(
      { success: false, message: "Assignment not found" },
      { status: 404 },
    );
  }

  if (assignment.deadline && new Date(assignment.deadline) < new Date()) {
    return NextResponse.json({
      success: false,
      message: "The deadline has passed",
    });
  }

  const submission = await Submission.findOneAndUpdate(
    {
      assignmentId: assignment._id,
      studentId: auth.user._id,
    },
    {
      assignmentId: assignment._id,
      studentId: auth.user._id,
      studentName: auth.user.fullName,
      studentClass: auth.user.studentClass,
      content: body.content || "",
      fileUrl: body.fileUrl || "",
      fileName: body.fileName || "",
      isGraded: false,
      grade: "",
      feedback: "",
    },
    { upsert: true, new: true },
  );

  return NextResponse.json({ success: true, submission });
}
