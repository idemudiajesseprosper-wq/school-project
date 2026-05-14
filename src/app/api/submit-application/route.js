import { connectMongoDB } from "../../../lib/connect";
import Application from "../../../models/Application";
import Code from "../../../models/Code";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const data = await req.json();

    await connectMongoDB();

    // ✅ Validate access code
    const foundCode = await Code.findOne({ code: data.code });

    if (!foundCode || foundCode.used) {
      return NextResponse.json({
        success: false,
        message: "Invalid or used code",
      });
    }

    // ✅ Save ONLY required fields (prevents bugs)
    const application = await Application.create({
      fullName: data.fullName,
      passport: data.passport,
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

      // 🔥 THIS IS WHAT YOU NEED
      classApplying: data.classApplying,

      disability: data.disability,
      healthCondition: data.healthCondition,
      specialAttention: data.specialAttention,
      parentName: data.parentName,
      parentAddress: data.parentAddress,
      parentOccupation: data.parentOccupation,
      parentPhone: data.parentPhone,
      status: "Pending",
    });

    // ✅ Mark code as used
    await Code.updateOne(
      { code: data.code },
      { $set: { used: true } }
    );

    return NextResponse.json({
      success: true,
      application,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Server error",
    });
  }
}