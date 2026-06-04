import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  code: String,

  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicantId: String,
  email: String,
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  paystackReference: String,

  passport: String,
  birthCertificate: String,
  previousSchoolResult: String,
  transferCertificate: String,

  // Student Info
  fullName: String,
  sex: String,
  dateOfBirth: String,
  phone: String,
  address: String,
  nativeTown: String,
  religion: String,
  state: String,
  nationality: String,

  // School history
  previousSchool: String,
  lastClassPassed: String,
  
  classApplying: String,

  // Medical
  disability: String,
  healthCondition: String,
  specialAttention: String,

  // Parent
  parentName: String,
  parentAddress: String,
  parentOccupation: String,
  parentPhone: String,

  status: {
  type: String,
  default: "Pending",
},
  studentIdNumber: String,
  reviewedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
