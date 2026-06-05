import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // BASIC INFO
    fullName: String,

    username: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    // ROLE SYSTEM
    role: {
      type: String,
      enum: ["admin", "student", "teacher", "applicant"],
      default: "student",
    },

    // EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    // LOGIN TRACKING
    lastLogin: {
      type: Date,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    // ACCOUNT STATUS
    isSuspended: {
      type: Boolean,
      default: false,
    },

    suspensionReason: {
      type: String,
      default: "",
    },

    suspendedAt: {
      type: Date,
    },

    // SOFT DELETE
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    // LOGIN HISTORY
    loginHistory: [
      {
        time: Date,
        ip: String,
        device: String,
      },
    ],

    // SECURITY
    lastLogout: Date,

    passwordChangedAt: Date,

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    accountLockedUntil: Date,

    // PROFILE
    avatar: {
      type: String,
      default: "",
    },

    phoneNumber: String,

    studentClass: String,

    // SCHOOL INFO
    admissionNumber: {
      type: String,
      default: "",
    },

    applicantId: {
      type: String,
      default: "",
    },

    studentIdNumber: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    applicationStatus: {
      type: String,
      enum: ["not_started", "submitted", "accepted", "rejected"],
      default: "not_started",
    },

    paystackReference: String,
    paymentDate: Date,

    dateOfBirth: String,

    gender: String,

    // PARENT / GUARDIAN
    parentName: String,

    parentPhone: String,

    parentEmail: String,

    relationship: String,

    // TEACHER SPECIFIC
    assignedClasses: [{ type: String }], // e.g. ["JSS1", "SS2"]
    subject: { type: String, default: "" }, // main subject
    assignedSubjects: [{ type: String }],
    classTeacherClasses: [{ type: String }],
    qualification: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

UserSchema.index(
  { admissionNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      role: "student",
      admissionNumber: { $exists: true, $gt: "" },
    },
  },
);
UserSchema.index({ role: 1, isDeleted: 1, createdAt: -1 });
UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ role: 1, studentClass: 1, isDeleted: 1, fullName: 1 });
UserSchema.index({ applicantId: 1 }, { sparse: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
