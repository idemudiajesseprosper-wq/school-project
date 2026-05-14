import { connectMongoDB } from "../../../lib/connect";
import Application from "../../../models/Application";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    await connectMongoDB();

    const { id, status } = await req.json();

    // Validate input
    if (!id || !status) {
      return NextResponse.json({
        success: false,
        message: "Missing fields",
      });
    }

    const allowed = ["Pending", "Approved", "Rejected"];

    if (!allowed.includes(status)) {
      return NextResponse.json({
        success: false,
        message: "Invalid status",
      });
    }

    // Update student + return updated document
    const student = await Application.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({
        success: false,
        message: "Student not found",
      });
    }

    // Send email if available
    if (student.email) {
      // APPROVED
      if (status === "Approved") {
        await resend.emails.send({
          from: "Admissions <onboarding@resend.dev>",
          to: student.email,
          subject: "Admission Approved 🎉",
          html: `
            <div style="font-family:Arial;padding:20px;">
              <h2>Congratulations!</h2>
              <p>Dear ${
                student.parentName || "Parent"
              },</p>

              <p>We are pleased to inform you that the admission application for <strong>${
                student.fullName
              }</strong> has been <strong>approved</strong>.</p>

              <p><strong>Class:</strong> ${
                student.classApplying || "-"
              }</p>

              <p>Please visit the school for documentation and next steps.</p>

              <br/>
              <p>Winners Foundation School</p>
            </div>
          `,
        });
      }

      // REJECTED
      if (status === "Rejected") {
        await resend.emails.send({
          from: "Admissions <onboarding@resend.dev>",
          to: student.email,
          subject: "Admission Update",
          html: `
            <div style="font-family:Arial;padding:20px;">
              <h2>Admission Update</h2>

              <p>Dear ${
                student.parentName || "Parent"
              },</p>

              <p>Thank you for applying for <strong>${
                student.fullName
              }</strong>.</p>

              <p>We regret to inform you that this application was not approved at this time.</p>

              <p>We appreciate your interest in our school.</p>

              <br/>
              <p>Winners Foundation School</p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}