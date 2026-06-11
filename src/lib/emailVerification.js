import Settings from "../models/Settings";

export async function requireEmailVerification() {
  if (process.env.REQUIRE_EMAIL_VERIFICATION === "true") return true;
  if (process.env.REQUIRE_EMAIL_VERIFICATION === "false") return false;

  const settings = await Settings.findOne().lean();
  return settings?.requireVerification !== false;
}
