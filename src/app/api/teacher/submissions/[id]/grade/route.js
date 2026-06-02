import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../../../lib/authUser";
import Assignment from "../../../../../../models/Assignment";
import Submission from "../../../../../../models/Submission";

export async function PATCH(req, { params }) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const { id } = await params;
  const { grade, feedback } = await req.json();

  const submission = await Submission.findById(id);

  if (!submission) {
    return NextResponse.json({ success: false, message: "Submission not found" }, { status: 404 });
  }

  const assignment = await Assignment.findOne({
    _id: submission.assignmentId,
    teacherId: auth.user._id,
    isDeleted: { $ne: true },
  });

  if (!assignment) {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  }

  submission.grade = grade || "";
  submission.feedback = feedback || "";
  submission.isGraded = Boolean(grade);

  await submission.save();

  return NextResponse.json({ success: true, submission });
}
