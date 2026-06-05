import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admissionNumber: {
      type: String,
      required: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    caScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    examScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
      required: true,
    },
  },
  { _id: false },
);

const ResultBatchSchema = new mongoose.Schema(
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
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scores: [ScoreSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ResultBatchSchema.index(
  { academicSession: 1, term: 1, className: 1, subject: 1 },
  { unique: true },
);
ResultBatchSchema.index({ teacher: 1, isDeleted: 1, updatedAt: -1 });
ResultBatchSchema.index({
  academicSession: 1,
  term: 1,
  className: 1,
  isDeleted: 1,
});

export default mongoose.models.ResultBatch ||
  mongoose.model("ResultBatch", ResultBatchSchema);
