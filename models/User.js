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

    isVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,

    loginHistory: [
      {
        time: Date,
        ip: String,
        device: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);