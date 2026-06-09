import { NextResponse } from "next/server";

import { requireApplicantEmailVerification } from "../../../lib/applicantVerification";
import { getAuthUser, unauthorized } from "../../../lib/authUser";
import { connectMongoDB } from "../../../lib/connect";
import { baseEmail, sendEnrollmentEmail } from "../../../lib/enrollmentEmail";
import Application from "../../../models/Application";
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

    if (auth.user.paymentStatus !== "paid") {
      return NextResponse.json(
        {
          success: false,
          message: "Pay the enrollment fee before starting application.",
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

    const application = await Application.findOneAndUpdate(
      { applicant: auth.user._id },
      {
        applicant: auth.user._id,
        applicantId: auth.user.applicantId,
        email: auth.user.email,
        paymentStatus: "paid",
        paystackReference: auth.user.paystackReference,
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
