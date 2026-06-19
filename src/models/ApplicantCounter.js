import mongoose from "mongoose";

const ApplicantCounterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    sequence: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.models.ApplicantCounter ||
  mongoose.model("ApplicantCounter", ApplicantCounterSchema);
