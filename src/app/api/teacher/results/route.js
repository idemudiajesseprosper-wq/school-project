import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import {
  classQueryValues,
  normalizeClassList,
  normalizeClassName,
} from "../../../../lib/classes";
import {
  gradeFromTotal,
  normalizeText,
  toScoreNumber,
} from "../../../../lib/results";
import ResultBatch from "../../../../models/ResultBatch";
import User from "../../../../models/User";

function teacherCanUpload(teacher, className, subject) {
  const classes = normalizeClassList(teacher.assignedClasses || []);
  const subjects = [
    teacher.subject,
    ...(teacher.assignedSubjects || []),
  ].filter(Boolean);

  return (
    classes.includes(normalizeClassName(className)) &&
    subjects.includes(subject)
  );
}

function readRowsFromWorkbook(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return [];

  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
    raw: false,
  });
}

function pick(row, names) {
  const entries = Object.entries(row);
  for (const [key, value] of entries) {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (names.includes(normalized)) return value;
  }
  return "";
}

async function buildScores(rows, className) {
  const studentClassValues = classQueryValues([className]);
  const admissionNumbers = rows
    .map((row) => normalizeText(pick(row, ["admissionnumber", "admissionno"])))
    .filter(Boolean);

  const students = await User.find({
    role: "student",
    studentClass: { $in: studentClassValues },
    admissionNumber: { $in: admissionNumbers },
    isDeleted: { $ne: true },
  })
    .select("fullName admissionNumber studentClass")
    .lean();

  const studentsByAdmission = new Map(
    students.map((student) => [student.admissionNumber, student]),
  );
  const scores = [];
  const errors = [];
  const seen = new Set();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const admissionNumber = normalizeText(
      pick(row, ["admissionnumber", "admissionno"]),
    );
    const studentName = normalizeText(pick(row, ["studentname", "name"]));
    const firstCaScore = toScoreNumber(
      pick(row, ["1stca", "firstca", "ca1", "firstcascore"]),
    );
    const secondCaScore = toScoreNumber(
      pick(row, ["2ndca", "secondca", "ca2", "secondcascore"]),
    );
    const oldCaScore = toScoreNumber(pick(row, ["cascore", "ca"]));
    const caScore =
      firstCaScore !== null || secondCaScore !== null
        ? (firstCaScore || 0) + (secondCaScore || 0)
        : oldCaScore;
    const examScore = toScoreNumber(pick(row, ["examscore", "exam", "exam80"]));

    if (!admissionNumber) {
      errors.push(`Row ${rowNumber}: Admission Number is required.`);
      return;
    }

    if (seen.has(admissionNumber)) {
      errors.push(`Row ${rowNumber}: Duplicate admission number in file.`);
      return;
    }
    seen.add(admissionNumber);

    const student = studentsByAdmission.get(admissionNumber);
    if (!student) {
      errors.push(
        `Row ${rowNumber}: ${admissionNumber} was not found in ${className}.`,
      );
      return;
    }

    if (
      (firstCaScore === null && secondCaScore !== null) ||
      (firstCaScore !== null && secondCaScore === null)
    ) {
      errors.push(`Row ${rowNumber}: enter both 1st CA and 2nd CA.`);
      return;
    }

    if (caScore === null || examScore === null) {
      errors.push(
        `Row ${rowNumber}: 1st CA, 2nd CA, and Exam Score must be numbers.`,
      );
      return;
    }

    if (firstCaScore !== null && (firstCaScore < 0 || firstCaScore > 10)) {
      errors.push(`Row ${rowNumber}: 1st CA must be between 0 and 10.`);
      return;
    }

    if (secondCaScore !== null && (secondCaScore < 0 || secondCaScore > 10)) {
      errors.push(`Row ${rowNumber}: 2nd CA must be between 0 and 10.`);
      return;
    }

    if (caScore < 0 || examScore < 0 || caScore + examScore > 100) {
      errors.push(
        `Row ${rowNumber}: scores must be positive and total must not exceed 100.`,
      );
      return;
    }

    if ((firstCaScore !== null || secondCaScore !== null) && examScore > 80) {
      errors.push(`Row ${rowNumber}: Exam score must be between 0 and 80.`);
      return;
    }

    const totalScore = caScore + examScore;
    const savedFirstCaScore =
      firstCaScore ?? Math.min(Math.max(caScore, 0), 10);
    const savedSecondCaScore =
      secondCaScore ?? Math.min(Math.max(caScore - savedFirstCaScore, 0), 10);
    scores.push({
      student: student._id,
      admissionNumber,
      studentName: student.fullName || studentName,
      caScore,
      firstCaScore: savedFirstCaScore,
      secondCaScore: savedSecondCaScore,
      examScore,
      totalScore,
      grade: gradeFromTotal(totalScore),
    });
  });

  return { scores, errors };
}

async function handleUpload(req, { allowUpdate }) {
  const auth = await getAuthUser(req, ["teacher"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const formData = await req.formData();
  const academicSession = normalizeText(formData.get("academicSession"));
  const term = normalizeText(formData.get("term"));
  const className = normalizeClassName(
    normalizeText(formData.get("className")),
  );
  const subject = normalizeText(formData.get("subject"));
  const file = formData.get("file");

  if (!academicSession || !term || !className || !subject) {
    return NextResponse.json(
      {
        success: false,
        message: "Session, term, class, and subject are required.",
      },
      { status: 400 },
    );
  }

  if (!teacherCanUpload(auth.user, className, subject)) {
    return NextResponse.json(
      {
        success: false,
        message: "You are not assigned to this class and subject.",
      },
      { status: 403 },
    );
  }

  if (!file || !file.name?.toLowerCase().endsWith(".xlsx")) {
    return NextResponse.json(
      { success: false, message: "Upload a valid .xlsx Excel file." },
      { status: 400 },
    );
  }

  const existing = await ResultBatch.findOne({
    academicSession,
    term,
    className,
    subject,
  });

  if (existing && !allowUpdate) {
    return NextResponse.json(
      {
        success: false,
        message:
          "A result already exists for this subject, class, session, and term. Use Update Scores instead.",
      },
      { status: 409 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows = readRowsFromWorkbook(buffer);
  if (!rows.length) {
    return NextResponse.json(
      { success: false, message: "The Excel sheet is empty." },
      { status: 400 },
    );
  }

  const { scores, errors } = await buildScores(rows, className);
  if (errors.length) {
    return NextResponse.json(
      { success: false, message: "Please fix the upload file.", errors },
      { status: 400 },
    );
  }

  const batch = await ResultBatch.findOneAndUpdate(
    { academicSession, term, className, subject },
    {
      academicSession,
      term,
      className,
      subject,
      teacher: auth.user._id,
      scores,
      isDeleted: false,
    },
    { new: true, upsert: true, runValidators: true },
  );

  return NextResponse.json({
    success: true,
    message: existing
      ? "Scores updated successfully."
      : "Scores uploaded successfully.",
    batch,
  });
}

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  const query = req.nextUrl.searchParams;
  const filters = {
    teacher: auth.user._id,
    isDeleted: { $ne: true },
  };

  for (const [key, field] of [
    ["academicSession", "academicSession"],
    ["term", "term"],
    ["className", "className"],
    ["subject", "subject"],
  ]) {
    const value = normalizeText(query.get(key));
    if (value) filters[field] = value;
  }

  const batches = await ResultBatch.find(filters)
    .select("academicSession term className subject scores updatedAt createdAt")
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ success: true, batches });
}

export async function POST(req) {
  return handleUpload(req, { allowUpdate: false });
}

export async function PATCH(req) {
  return handleUpload(req, { allowUpdate: true });
}
