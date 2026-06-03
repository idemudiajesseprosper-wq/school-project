import mongoose from "mongoose";

const RemarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classTeacherRemark: {
      type: String,
      default: "",
    },
    principalRemark: {
      type: String,
      default: "",
    },
    attendance: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const ResultPublicationSchema = new mongoose.Schema(
  {
    academicSession: {
      type: String,
      required: true,
      trim: true,
    },
    term: {
      type: String,
      required: true,
      trim: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    remarks: [RemarkSchema],
    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

ResultPublicationSchema.index(
  { academicSession: 1, term: 1, className: 1 },
  { unique: true }
);

export default mongoose.models.ResultPublication ||
  mongoose.model("ResultPublication", ResultPublicationSchema);
