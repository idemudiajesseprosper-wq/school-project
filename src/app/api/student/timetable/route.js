import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import { classQueryValues, normalizeClassName } from "../../../../lib/classes";
import Timetable from "../../../../models/Timetable";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const studentClass = normalizeClassName(auth.user.studentClass);
  const timetable = await Timetable.findOne({
    class: { $in: classQueryValues([studentClass]) },
  }).lean();

  return NextResponse.json({ success: true, timetable });
}
