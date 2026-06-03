import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/connect";
import AdmissionCounter from "../../../../models/AdmissionCounter";
import User from "../../../../models/User";

async function generateAdmissionNumber() {
  const year = new Date().getFullYear();
  const counter = await AdmissionCounter.findOneAndUpdate(
    { year },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  return `SCH/${year}/${String(counter.sequence).padStart(4, "0")}`;
}

export async function POST(req) {
  try {
    const {
      fullName,
      email,
      password,
      dateOfBirth,
      gender,
      studentClass,
      phoneNumber,
      parentName,
      parentPhone,
      parentEmail,
      relationship,
      role,
      assignedClasses,
      subject,
      qualification,
    } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const requestedRole = role === "teacher" ? "teacher" : "student";
    const generatedAdmissionNumber =
      requestedRole === "student" ? await generateAdmissionNumber() : "";

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: requestedRole,

      // AUTO VERIFIED — re-enable when domain is ready
      isVerified: true,
      verificationToken: null,

      // STUDENT INFO
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      studentClass: studentClass || "",
      admissionNumber: generatedAdmissionNumber,
      phoneNumber: phoneNumber || "",

      // PARENT / GUARDIAN
      parentName: parentName || "",
      parentPhone: parentPhone || "",
      parentEmail: parentEmail || "",
      relationship: relationship || "",

      // TEACHER INFO
      assignedClasses: requestedRole === "teacher" && Array.isArray(assignedClasses)
        ? assignedClasses.filter(Boolean)
        : [],
      subject: requestedRole === "teacher" ? subject || "" : "",
      assignedSubjects: requestedRole === "teacher" ? [subject].filter(Boolean) : [],
      classTeacherClasses: requestedRole === "teacher" && Array.isArray(assignedClasses)
        ? assignedClasses.filter(Boolean)
        : [],
      qualification: requestedRole === "teacher" ? qualification || "" : "",
    });

    return NextResponse.json({
      success: true,
      admissionNumber: generatedAdmissionNumber,
      message: requestedRole === "student"
        ? `Registration successful. Admission number: ${generatedAdmissionNumber}`
        : "Registration successful. You can now log in.",
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
