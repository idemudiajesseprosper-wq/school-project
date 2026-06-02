import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Timetable from "../../../../models/Timetable";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const VALID_TYPES = ["subject", "break", "assembly"];

function normalizeDays(days = [], teacher) {
  return DAYS.map((day) => {
    const provided = days.find((item) => item.day === day);
    const periods = Array.from({ length: 8 }, (_, index) => {
      const period = provided?.periods?.[index] || {};
      const type = VALID_TYPES.includes(period.type) ? period.type : "subject";

      return {
        periodNumber: index + 1,
        type,
        subject: type === "subject" ? period.subject || "" : "",
        teacherName: type === "subject" ? period.teacherName || teacher.fullName : "",
        teacherId: type === "subject" ? period.teacherId || teacher._id : undefined,
        startTime: period.startTime || "",
        endTime: period.endTime || "",
      };
    });

    return { day, periods };
  });
}

export async function GET(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const className = req.nextUrl.searchParams.get("class");

  if (!className || !(auth.user.assignedClasses || []).includes(className)) {
    return NextResponse.json({ success: false, message: "Invalid class" }, { status: 403 });
  }

  const timetable = await Timetable.findOne({ class: className }).lean();

  return NextResponse.json({ success: true, timetable });
}

export async function PATCH(req) {
  const auth = await getAuthUser(req, ["teacher"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const body = await req.json();
  const className = body.class;

  if (!className || !(auth.user.assignedClasses || []).includes(className)) {
    return NextResponse.json({ success: false, message: "Invalid class" }, { status: 403 });
  }

  const timetable = await Timetable.findOneAndUpdate(
    { class: className },
    {
      class: className,
      days: normalizeDays(body.days, auth.user),
      lastUpdatedBy: auth.user.fullName,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, timetable });
}
