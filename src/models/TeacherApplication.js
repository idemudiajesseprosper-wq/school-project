import mongoose from "mongoose";

const TeacherApplicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    subjects: [{ type: String, trim: true }],
    preferredClasses: [{ type: String, trim: true }],
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
    },
    currentLocation: {
      type: String,
      default: "",
      trim: true,
    },
    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },
    cvUrl: {
      type: String,
      required: true,
    },
    cvFileName: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "rejected", "hired"],
      default: "new",
    },
    reviewedAt: Date,
  },
  { timestamps: true },
);

TeacherApplicationSchema.index({ status: 1, createdAt: -1 });
TeacherApplicationSchema.index({ email: 1, createdAt: -1 });
TeacherApplicationSchema.index({ subject: 1, createdAt: -1 });
TeacherApplicationSchema.index({ subjects: 1, createdAt: -1 });
TeacherApplicationSchema.index({ preferredClasses: 1, createdAt: -1 });

export default mongoose.models.TeacherApplication ||
  mongoose.model("TeacherApplication", TeacherApplicationSchema);
