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
      enum: ["admin", "student"],
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);