export function requireApplicantEmailVerification() {
  return process.env.REQUIRE_APPLICANT_EMAIL_VERIFICATION === "true";
}
