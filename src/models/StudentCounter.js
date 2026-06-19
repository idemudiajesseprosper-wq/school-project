import mongoose from "mongoose";

const StudentCounterSchema = new mongoose.Schema(
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

export default mongoose.models.StudentCounter ||
  mongoose.model("StudentCounter", StudentCounterSchema);
