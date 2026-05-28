import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  schoolName: String,

  schoolEmail: String,

  schoolAddress: String,

  allowRegistration: {
    type: Boolean,
    default: true,
  },

  requireVerification: {
    type: Boolean,
    default: true,
  },

  maintenanceMode: {
    type: Boolean,
    default: false,
  },

  maxLoginAttempts: {
    type: Number,
    default: 5,
  },
});

export default mongoose.models.Settings ||
mongoose.model("Settings", settingsSchema);