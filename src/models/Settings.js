import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: "Winners' Foundation School" },

  schoolEmail: { type: String, default: "wfsonline1999@gmail.com" },

  schoolAddress: {
    type: String,
    default:
      "2, Airhueghiomon street, Osazuwa, Off Etete Road, Enogie, Benin City",
  },

  supportEmail: { type: String, default: "wfsonline1999@gmail.com" },

  schoolWebsite: { type: String, default: "" },

  timezone: { type: String, default: "Africa/Lagos" },

  language: { type: String, default: "en" },

  academicYear: { type: String, default: "2025/2026" },

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

  sessionTimeout: { type: Number, default: 30 },

  twoFactorAuth: { type: Boolean, default: false },

  passwordMinLength: { type: Number, default: 8 },

  emailNotifications: { type: Boolean, default: true },

  smsNotifications: { type: Boolean, default: false },

  notifyOnNewStudent: { type: Boolean, default: true },

  notifyOnLogin: { type: Boolean, default: false },

  notifyOnSystemErrors: { type: Boolean, default: true },

  digestFrequency: { type: String, default: "daily" },

  primaryColor: { type: String, default: "#2563eb" },

  logoUrl: { type: String, default: "/logo.PNG" },

  darkMode: { type: Boolean, default: false },

  compactView: { type: Boolean, default: false },

  showWelcomeMessage: { type: Boolean, default: true },

  welcomeMessage: {
    type: String,
    default: "Welcome back to Winners' Foundation School Portal.",
  },
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
