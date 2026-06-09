import ApplicantCounter from "../models/ApplicantCounter";
import Application from "../models/Application";
import StudentCounter from "../models/StudentCounter";
import User from "../models/User";

export const ENROLLMENT_FEE_NAIRA = 6000;
export const ENROLLMENT_FEE_KOBO = ENROLLMENT_FEE_NAIRA * 100;

export async function generateApplicantId() {
  const year = new Date().getFullYear();
  const counter = await ApplicantCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true },
  );

  return `APP-${year}-${String(counter.sequence).padStart(4, "0")}`;
}

export async function generateStudentIdNumber() {
  const year = new Date().getFullYear();
  const prefix = `STU-${year}-`;
  const existingHighestSequence =
    await getHighestExistingStudentSequence(prefix);

  await StudentCounter.findOneAndUpdate(
    { year },
    { $max: { sequence: existingHighestSequence } },
    { upsert: true },
  );

  const counter = await StudentCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true },
  );

  return `STU-${year}-${String(counter.sequence).padStart(4, "0")}`;
}

async function getHighestExistingStudentSequence(prefix) {
  const studentIdPattern = new RegExp(`^${escapeRegExp(prefix)}\\d+$`);

  const [users, applications] = await Promise.all([
    User.find({
      $or: [
        { studentIdNumber: studentIdPattern },
        { admissionNumber: studentIdPattern },
      ],
    })
      .select("studentIdNumber admissionNumber")
      .lean(),
    Application.find({ studentIdNumber: studentIdPattern })
      .select("studentIdNumber")
      .lean(),
  ]);

  return [...users, ...applications].reduce((highest, record) => {
    return Math.max(
      highest,
      getSequence(record.studentIdNumber, prefix),
      getSequence(record.admissionNumber, prefix),
    );
  }, 0);
}

function getSequence(value, prefix) {
  if (!value?.startsWith(prefix)) return 0;

  const sequence = Number.parseInt(value.slice(prefix.length), 10);
  return Number.isNaN(sequence) ? 0 : sequence;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeApplicationStatus(status) {
  if (status === "Approved") return "accepted";
  if (status === "Rejected") return "rejected";
  if (status === "Pending") return "submitted";
  return "not_started";
}
