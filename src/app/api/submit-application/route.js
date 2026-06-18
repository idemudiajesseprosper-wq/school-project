import { NextResponse } from "next/server";

import { requireApplicantEmailVerification } from "../../../lib/applicantVerification";
import { getAuthUser, unauthorized } from "../../../lib/authUser";
import { connectMongoDB } from "../../../lib/connect";
import { baseEmail, sendEnrollmentEmail } from "../../../lib/enrollmentEmail";
import { logActivity } from "../../../lib/logActivity";
import Application from "../../../models/Application";
import Settings from "../../../models/Settings";
import User from "../../../models/User";

export async function POST(req) {
  const auth = await getAuthUser(req, ["applicant"]);
  if (!auth.user) return unauthorized(auth.error, auth.status);

  try {
    const data = await req.json();

    if (requireApplicantEmailVerification() && !auth.user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Please verify your email before applying.",
        },
        { status: 403 },
      );
    }

    if (
      !data.fullName ||
      !data.classApplying ||
      !data.parentName ||
      !data.parentPhone
    ) {
      return NextResponse.json(
        { success: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    await connectMongoDB();
    const [settings, existingApplication] = await Promise.all([
      Settings.findOne().lean(),
      Application.findOne({ applicant: auth.user._id }).lean(),
    ]);

    const application = await Application.findOneAndUpdate(
      { applicant: auth.user._id },
      {
        applicant: auth.user._id,
        applicantId: auth.user.applicantId,
        email: auth.user.email,
        paymentStatus: auth.user.paymentStatus === "paid" ? "paid" : "unpaid",
        paystackReference: auth.user.paystackReference || "",
        fullName: data.fullName,
        passport: data.passport,
        birthCertificate: data.birthCertificate || "",
        previousSchoolResult: data.previousSchoolResult || "",
        transferCertificate: data.transferCertificate || "",
        sex: data.sex,
        dateOfBirth: data.dateOfBirth,
        phone: data.phone,
        address: data.address,
        nativeTown: data.nativeTown,
        religion: data.religion,
        state: data.state,
        nationality: data.nationality,
        previousSchool: data.previousSchool,
        lastClassPassed: data.lastClassPassed,
        classApplying: data.classApplying,
        disability: data.disability,
        healthCondition: data.healthCondition,
        specialAttention: data.specialAttention,
        parentName: data.parentName,
        parentAddress: data.parentAddress,
        parentOccupation: data.parentOccupation,
        parentPhone: data.parentPhone,
        status: "Pending",
      },
      { upsert: true, new: true },
    );

    await User.findByIdAndUpdate(auth.user._id, {
      applicationStatus: "submitted",
      fullName: data.fullName,
      phoneNumber: data.phone || auth.user.phoneNumber,
      studentClass: data.classApplying,
      avatar: data.passport || auth.user.avatar,
      parentName: data.parentName,
      parentPhone: data.parentPhone,
    });

    await sendEnrollmentEmail({
      to: auth.user.email,
      subject: "Application Submitted",
      html: baseEmail(
        "Application Submitted Successfully",
        `<p>Dear <strong>${data.fullName}</strong>, your application has been submitted and is now under review.</p>`,
      ),
    });

    if (settings?.notifyOnNewStudent !== false) {
      const isNewApplication = !existingApplication;
      await logActivity({
        userId: auth.user._id,
        userName: data.fullName,
        action: isNewApplication
          ? "APPLICATION_SUBMITTED"
          : "APPLICATION_RESUBMITTED",
        target: auth.user.email,
        metadata: {
          role: "applicant",
          applicantId: auth.user.applicantId,
          applicationId: String(application._id),
          classApplying: data.classApplying,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          paymentStatus: application.paymentStatus,
          status: application.status,
          alertType: "admission_application_pending_approval",
          emailNotifications: settings?.emailNotifications !== false,
          smsNotifications: settings?.smsNotifications === true,
        },
      });

      if (settings?.emailNotifications !== false) {
        const adminEmail =
          settings?.supportEmail ||
          settings?.schoolEmail ||
          "wfsonline1999@gmail.com";

        await sendEnrollmentEmail({
          to: adminEmail,
          subject: isNewApplication
            ? "New admission application pending approval"
            : "Admission application resubmitted",
          html: baseEmail(
            isNewApplication
              ? "New Admission Application"
              : "Admission Application Resubmitted",
            `<p><strong>${data.fullName}</strong> submitted an admission application and is waiting for admin review.</p>
             <p><strong>Class applying:</strong> ${data.classApplying}</p>
             <p><strong>Applicant ID:</strong> ${auth.user.applicantId || "Not set"}</p>
             <p><strong>Email:</strong> ${auth.user.email}</p>
             <p><strong>Parent/Guardian:</strong> ${data.parentName} (${data.parentPhone})</p>
             <p><strong>Payment status:</strong> ${application.paymentStatus}</p>`,
          ),
        });
      }
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.log("SUBMIT APPLICATION ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
