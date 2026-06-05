import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  userName: String,

  action: {
    type: String,
    required: true,
  },

  target: String,

  ipAddress: String,

  metadata: Object,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Activity ||
  mongoose.model("Activity", activitySchema);
