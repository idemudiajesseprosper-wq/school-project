import mongoose from "mongoose";

const PeriodSchema = new mongoose.Schema({
  periodNumber: { type: Number }, // 1-8
  type: {
    type: String,
    enum: ["subject", "break", "assembly"],
    default: "subject",
  },
  subject: { type: String, default: "" },
  teacherName: { type: String, default: "" },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startTime: { type: String, default: "" }, // e.g. "07:30"
  endTime: { type: String, default: "" }, // e.g. "08:30"
});

const DaySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
  periods: [PeriodSchema],
});

const TimetableSchema = new mongoose.Schema(
  {
    class: { type: String, required: true, unique: true },
    days: [DaySchema],
    lastUpdatedBy: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Timetable ||
  mongoose.model("Timetable", TimetableSchema);
