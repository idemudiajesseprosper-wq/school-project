import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

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

    if (!file) {
      return NextResponse.json({ success: false, error: "No file selected" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          use_filename: true,
          unique_filename: true,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
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
