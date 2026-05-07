import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: String,

    username: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

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

    // LOGIN HISTORY
    loginHistory: [
      {
        time: Date,

        ip: String,

        device: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);