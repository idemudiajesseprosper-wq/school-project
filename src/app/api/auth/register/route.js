import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import {
  normalizeClassList,
  normalizeClassName,
} from "../../../../lib/classes";
import { connectMongoDB } from "../../../../lib/connect";
import {
  getRequestBaseUrl,
  sendVerificationEmail,
} from "../../../../lib/email";
import { requireEmailVerification } from "../../../../lib/emailVerification";
import { generateStudentIdNumber } from "../../../../lib/enrollment";
import User from "../../../../models/User";

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
      avatar,
      role,
      assignedClasses,
      subject,
      assignedSubjects,
      qualification,
    } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    await connectMongoDB();

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const requestedRole = role === "teacher" ? "teacher" : "student";
    const normalizedStudentClass =
      requestedRole === "student" ? normalizeClassName(studentClass) : "";
    const normalizedAssignedClasses =
      requestedRole === "teacher" && Array.isArray(assignedClasses)
        ? normalizeClassList(assignedClasses)
        : [];
    const normalizedAssignedSubjects =
      requestedRole === "teacher" && Array.isArray(assignedSubjects)
        ? Array.from(
            new Set(
              assignedSubjects
                .map((item) => String(item || "").trim())
                .filter(Boolean),
            ),
          )
        : [subject].map((item) => String(item || "").trim()).filter(Boolean);
    const primarySubject = normalizedAssignedSubjects[0] || "";
    const generatedStudentId =
      requestedRole === "student" ? await generateStudentIdNumber() : "";
    const needsVerification = await requireEmailVerification();
    const verificationToken = needsVerification
      ? crypto.randomBytes(32).toString("hex")
      : null;

    await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      role: requestedRole,
      isVerified: !needsVerification,
      verificationToken,

      // STUDENT INFO
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      studentClass: normalizedStudentClass,
      admissionNumber: generatedStudentId,
      studentIdNumber: generatedStudentId,
      phoneNumber: phoneNumber || "",
      avatar: avatar || "",

      // PARENT / GUARDIAN
      parentName: parentName || "",
      parentPhone: parentPhone || "",
      parentEmail: parentEmail || "",
      relationship: relationship || "",

      // TEACHER INFO
      assignedClasses: normalizedAssignedClasses,
      subject: requestedRole === "teacher" ? primarySubject : "",
      assignedSubjects:
        requestedRole === "teacher" ? normalizedAssignedSubjects : [],
      classTeacherClasses: normalizedAssignedClasses,
      qualification: requestedRole === "teacher" ? qualification || "" : "",
    });

    if (needsVerification) {
      await sendVerificationEmail(
        normalizedEmail,
        fullName,
        verificationToken,
        getRequestBaseUrl(req),
      );
    }

    return NextResponse.json({
      success: true,
      admissionNumber: generatedStudentId,
      studentIdNumber: generatedStudentId,
      message:
        requestedRole === "student"
          ? `Registration successful. Student ID: ${generatedStudentId}. Please verify your email before logging in.`
          : "Registration successful. Please verify your email before logging in.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}
