import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const folder = data.get("folder") || "school-portal";
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]);

    if (!file) {
      return NextResponse.json({ success: false, error: "No file selected" });
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "File must not exceed 5MB" },
        { status: 400 },
      );
    }

    if (file.type && !allowedTypes.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Unsupported file type" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "auto",
            use_filename: true,
            unique_filename: true,
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: upload.secure_url,
      publicId: upload.public_id,
      originalName: file.name,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    return NextResponse.json({ success: false, error: "Upload failed" });
  }
}
