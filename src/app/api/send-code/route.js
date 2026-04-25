import { connectMongoDB } from "../../../../lib/connect";
import Code from "../../../../models/Code";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    await connectMongoDB();

    const { code, email, parentName } = await req.json();

    if (!code || !email) {
      return NextResponse.json({
        success: false,
        message: "Missing fields",
      });
    }

    const existingCode = await Code.findOne({ code });

    if (!existingCode) {
      return NextResponse.json({
        success: false,
        message: "Invalid code",
      });
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Admission Access Code",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Admission Access Code</h2>

          <p>Dear ${parentName || "Parent"},</p>

          <p>You have requested an admission form.</p>

          <p><strong>Your Access Code:</strong></p>

          <h1 style="letter-spacing:2px;">${code}</h1>

          <p>Use this code on the application portal to begin.</p>

          <br/>
          <p>Winners Foundation School</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Code sent successfully",
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Failed to send email",
    });
  }
}