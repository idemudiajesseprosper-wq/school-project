import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    classes: [{ type: String }], // target classes
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    teacherName: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

NotificationSchema.index({ classes: 1, isDeleted: 1, createdAt: -1 });
NotificationSchema.index({ teacherId: 1, isDeleted: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
