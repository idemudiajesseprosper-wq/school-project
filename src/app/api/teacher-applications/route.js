import { NextResponse } from "next/server";

import { connectMongoDB } from "../../../lib/connect";
import { baseEmail, sendEnrollmentEmail } from "../../../lib/enrollmentEmail";
import TeacherApplication from "../../../models/TeacherApplication";

function clean(value) {
  return String(value || "").trim();
}

function cleanList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(clean).filter(Boolean))];
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const fullName = clean(body.fullName);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const subjects = cleanList(body.subjects);
    const subject = subjects[0] || clean(body.subject);
    const preferredClasses = cleanList(body.preferredClasses);
    const qualification = clean(body.qualification);
    const currentLocation = clean(body.currentLocation);
    const coverLetter = clean(body.coverLetter);
    const cvUrl = clean(body.cvUrl);
    const cvFileName = clean(body.cvFileName);
    const yearsOfExperience = Math.max(Number(body.yearsOfExperience) || 0, 0);

    if (!fullName || !email || !phone || !subject || !qualification || !cvUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Full name, email, phone, subject, qualification, and CV are required.",
        },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const application = await TeacherApplication.create({
      fullName,
      email,
      phone,
      subject,
      subjects: subjects.length ? subjects : [subject],
      preferredClasses,
      qualification,
      yearsOfExperience,
      currentLocation,
      coverLetter,
      cvUrl,
      cvFileName,
    });

    await Promise.allSettled([
      sendEnrollmentEmail({
        to: email,
        subject: "Teacher Application Received",
        html: baseEmail(
          "Teacher Application Received",
          `<p>Dear <strong>${fullName}</strong>, your teaching application for <strong>${subjects.length ? subjects.join(", ") : subject}</strong> has been received. Our team will review your CV and contact you if your profile matches an available role.</p>`,
        ),
      }),
      sendEnrollmentEmail({
        to: process.env.SCHOOL_EMAIL || "wfsonline1999@gmail.com",
        subject: `New Teacher Application - ${subject}`,
        html: baseEmail(
          "New Teacher Application",
          `<p><strong>${fullName}</strong> applied to teach <strong>${subjects.length ? subjects.join(", ") : subject}</strong>.</p>
          <p>Email: ${email}<br/>Phone: ${phone}<br/>Qualification: ${qualification}<br/>Experience: ${yearsOfExperience} year(s)<br/>Preferred classes: ${preferredClasses.length ? preferredClasses.join(", ") : "Not specified"}</p>
          <p><a href="${cvUrl}">View uploaded CV</a></p>`,
        ),
      }),
    ]);

    return NextResponse.json({
      success: true,
      applicationId: application._id,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.log("TEACHER APPLICATION ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Could not submit application" },
      { status: 500 },
    );
  }
}
