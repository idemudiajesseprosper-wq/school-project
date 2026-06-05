import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    classes: [{ type: String }], // e.g. ["JSS1", "JSS2"]
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherName: { type: String },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    deadline: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AssignmentSchema.index({ classes: 1, isDeleted: 1, deadline: 1 });
AssignmentSchema.index({ teacherId: 1, isDeleted: 1, createdAt: -1 });

export default mongoose.models.Assignment ||
  mongoose.model("Assignment", AssignmentSchema);
