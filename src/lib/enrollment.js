import ApplicantCounter from "../models/ApplicantCounter";
import StudentCounter from "../models/StudentCounter";

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
  const counter = await StudentCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true },
  );

  return `STU-${year}-${String(counter.sequence).padStart(4, "0")}`;
}

export function normalizeApplicationStatus(status) {
  if (status === "Approved") return "accepted";
  if (status === "Rejected") return "rejected";
  if (status === "Pending") return "submitted";
  return "not_started";
}
