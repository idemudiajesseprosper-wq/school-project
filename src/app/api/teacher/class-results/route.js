import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { compileClassResults, normalizeText } from "../../../../lib/results";
import ResultPublication from "../../../../models/ResultPublication";

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const query = req.nextUrl.searchParams;
  const academicSession = normalizeText(query.get("academicSession"));
  const term = normalizeText(query.get("term"));
  const className = normalizeText(query.get("className"));

  if (!academicSession || !term || !className) {
    return NextResponse.json(
      { success: false, message: "Session, term, and class are required." },
      { status: 400 }
    );
  }

  if (!(auth.user.assignedClasses || []).includes(className)) {
    return NextResponse.json(
      { success: false, message: "You are not assigned to this class." },
      { status: 403 }
    );
  }

  const result = await compileClassResults({ academicSession, term, className });
  return NextResponse.json({ success: true, result });
}

export async function PATCH(req) {
  const auth = await getAuthUser(req, ["teacher"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const body = await req.json();
  const academicSession = normalizeText(body.academicSession);
  const term = normalizeText(body.term);
  const className = normalizeText(body.className);
  const remarks = Array.isArray(body.remarks) ? body.remarks : [];

  if (!academicSession || !term || !className) {
    return NextResponse.json(
      { success: false, message: "Session, term, and class are required." },
      { status: 400 }
    );
  }

  if (!(auth.user.assignedClasses || []).includes(className)) {
    return NextResponse.json(
      { success: false, message: "You are not assigned to this class." },
      { status: 403 }
    );
  }

  const cleanRemarks = remarks
    .filter((remark) => remark.studentId)
    .map((remark) => ({
      student: remark.studentId,
      classTeacherRemark: normalizeText(remark.classTeacherRemark),
      principalRemark: normalizeText(remark.principalRemark),
      attendance: normalizeText(remark.attendance),
    }));

  const publication = await ResultPublication.findOneAndUpdate(
    { academicSession, term, className },
    { $set: { remarks: cleanRemarks } },
    { new: true, upsert: true, runValidators: true }
  );

  return NextResponse.json({
    success: true,
    message: "Remarks saved successfully.",
    publication,
  });
}
