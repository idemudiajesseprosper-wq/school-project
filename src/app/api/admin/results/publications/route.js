import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../../lib/authUser";
import { compileClassResults, normalizeText } from "../../../../../lib/results";
import ResultPublication from "../../../../../models/ResultPublication";

export async function GET(req) {
  const auth = await getAuthUser(req, ["admin"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const publications = await ResultPublication.find({})
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ success: true, publications });
}

export async function POST(req) {
  const auth = await getAuthUser(req, ["admin"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const body = await req.json();
  const academicSession = normalizeText(body.academicSession);
  const term = normalizeText(body.term);
  const className = normalizeText(body.className);
  const isPublished = Boolean(body.isPublished);

  if (!academicSession || !term || !className) {
    return NextResponse.json(
      { success: false, message: "Session, term, and class are required." },
      { status: 400 },
    );
  }

  const compiled = await compileClassResults({
    academicSession,
    term,
    className,
  });

  const publication = await ResultPublication.findOneAndUpdate(
    { academicSession, term, className },
    {
      $set: {
        isPublished,
        publishedBy: auth.user._id,
        publishedAt: isPublished ? new Date() : null,
      },
      $setOnInsert: {
        remarks: compiled.students.map((student) => ({
          student: student.studentId,
          classTeacherRemark: student.classTeacherRemark,
          principalRemark: student.principalRemark,
          attendance: student.attendance,
        })),
      },
    },
    { new: true, upsert: true, runValidators: true },
  );

  return NextResponse.json({
    success: true,
    message: isPublished ? "Results published." : "Results unpublished.",
    publication,
  });
}
