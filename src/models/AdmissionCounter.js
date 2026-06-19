import mongoose from "mongoose";

const AdmissionCounterSchema = new mongoose.Schema(
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

export default mongoose.models.AdmissionCounter ||
  mongoose.model("AdmissionCounter", AdmissionCounterSchema);
