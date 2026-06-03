import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { compileClassResults, normalizeText } from "../../../../lib/results";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const query = req.nextUrl.searchParams;
  const academicSession = normalizeText(query.get("academicSession"));
  const term = normalizeText(query.get("term"));
  const className = auth.user.studentClass;

  if (!academicSession || !term || !className) {
    return NextResponse.json(
      { success: false, message: "Session and term are required." },
      { status: 400 }
    );
  }

  const result = await compileClassResults({ academicSession, term, className });
  if (!result.isPublished) {
    return NextResponse.json(
      { success: false, message: "This result has not been published yet." },
      { status: 403 }
    );
  }

  const student = result.students.find(
    (item) => item.studentId === String(auth.user._id)
  );

  if (!student) {
    return NextResponse.json(
      { success: false, message: "Result not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    result: {
      academicSession,
      term,
      className,
      schoolName: "Winners' Foundation School",
      schoolLogo: "/logo.PNG",
      student,
    },
  });
}
