import { NextResponse } from "next/server";

import { getAuthUser, unauthorized } from "../../../../lib/authUser";
import Timetable from "../../../../models/Timetable";

export async function GET(req) {
  const auth = await getAuthUser(req, ["student"]);

  if (!auth.user) {
    return unauthorized(auth.error, auth.status);
  }

  const timetable = await Timetable.findOne({ class: auth.user.studentClass }).lean();

  return NextResponse.json({ success: true, timetable });
}
