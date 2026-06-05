import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String },
    studentClass: { type: String },
    content: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileName: { type: String, default: "" },
    grade: { type: String, default: "" },
    feedback: { type: String, default: "" },
    isGraded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

SubmissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ studentId: 1, createdAt: -1 });
SubmissionSchema.index({ assignmentId: 1, createdAt: -1 });

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);
