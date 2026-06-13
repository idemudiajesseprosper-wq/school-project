import ResultBatch from "../models/ResultBatch";
import ResultPublication from "../models/ResultPublication";
import User from "../models/User";
import { classQueryValues, normalizeClassName } from "./classes";

export function normalizeText(value) {
  return String(value || "").trim();
}

export function gradeFromTotal(total) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

export function remarkFromAverage(average) {
  if (average >= 80)
    return "Excellent performance. Keep up the outstanding work.";
  if (average >= 70)
    return "Very good performance. Continue striving for excellence.";
  if (average >= 60) return "Good performance. There is room for improvement.";
  if (average >= 50) return "Fair performance. More effort is required.";
  return "Needs significant improvement and closer attention to studies.";
}

export function overallGradeFromAverage(average) {
  return gradeFromTotal(Math.round(average || 0));
}

export function toScoreNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return number;
}

export async function compileClassResults({
  academicSession,
  term,
  className,
}) {
  const normalizedClassName = normalizeClassName(className);
  const classValues = classQueryValues([normalizedClassName]);
  const [students, batches, publication] = await Promise.all([
    User.find({
      role: "student",
      studentClass: { $in: classValues },
      isDeleted: { $ne: true },
    })
      .select("fullName admissionNumber studentClass avatar")
      .sort({ fullName: 1 })
      .lean(),
    ResultBatch.find({
      academicSession,
      term,
      className: { $in: classValues },
      isDeleted: { $ne: true },
    })
      .select("subject scores")
      .lean(),
    ResultPublication.findOne({
      academicSession,
      term,
      className: { $in: classValues },
    }).lean(),
  ]);

  const remarksByStudent = new Map(
    (publication?.remarks || []).map((remark) => [
      String(remark.student),
      remark,
    ]),
  );

  const rows = students.map((student) => {
    const subjects = [];

    for (const batch of batches) {
      const score = batch.scores.find(
        (item) => String(item.student) === String(student._id),
      );

      if (score) {
        subjects.push({
          subject: batch.subject,
          caScore: score.caScore,
          examScore: score.examScore,
          totalScore: score.totalScore,
          grade: score.grade,
        });
      }
    }

    const totalScore = subjects.reduce((sum, item) => sum + item.totalScore, 0);
    const averageScore = subjects.length
      ? Number((totalScore / subjects.length).toFixed(2))
      : 0;
    const savedRemark = remarksByStudent.get(String(student._id));

    return {
      studentId: String(student._id),
      studentName: student.fullName,
      admissionNumber: student.admissionNumber,
      className: student.studentClass,
      passport: student.avatar || "",
      subjects,
      totalScore,
      averageScore,
      overallGrade: overallGradeFromAverage(averageScore),
      position: null,
      classTeacherRemark:
        savedRemark?.classTeacherRemark || remarkFromAverage(averageScore),
      principalRemark: savedRemark?.principalRemark || "",
      attendance: savedRemark?.attendance || "",
    };
  });

  rows.sort(
    (a, b) =>
      b.totalScore - a.totalScore || a.studentName.localeCompare(b.studentName),
  );

  let previousTotal = null;
  let previousPosition = 0;
  rows.forEach((row, index) => {
    if (row.totalScore === previousTotal) {
      row.position = previousPosition;
    } else {
      row.position = index + 1;
      previousPosition = row.position;
      previousTotal = row.totalScore;
    }
  });

  return {
    academicSession,
    term,
    className: normalizedClassName,
    isPublished: Boolean(publication?.isPublished),
    students: rows,
    subjects: batches.map((batch) => batch.subject).sort(),
  };
}
