"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const STEPS = ["Access", "Personal", "Parent", "Account"];

const CLASSES = [
  "Nursery 1", "Nursery 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS1", "JSS2", "JSS3",
  "SS1", "SS2", "SS3",
];

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [form, setForm] = useState({
    accessCode: "",
    accountType: "student",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    studentClass: "",
    admissionNumber: "", // optional
    phoneNumber: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    relationship: "",
    email: "",
    password: "",
    confirmPassword: "",
    assignedClasses: [],
    subject: "",
    qualification: "",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // GOOGLE SIGN-UP
  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/student", redirect: false });
      if (result?.error) { toast.error("Google sign-up failed. Try again."); setGoogleLoading(false); }
      else if (result?.url) router.push(result.url);
    } catch { toast.error("Something went wrong"); setGoogleLoading(false); }
  };

  // STEP 0 — verify access code
  const verifyCode = async () => {
    if (!form.accessCode.trim()) { toast.error("Enter your access code"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.accessCode.trim() }),
      });
      const data = await res.json();
      if (data.valid) { toast.success("Code verified!"); update("accountType", "student"); setStep(1); }
      else toast.error(data.message || "Invalid access code");
    } catch { toast.error("Could not verify code"); }
    setLoading(false);
  };

  // STEP 1 — personal info validation (admissionNumber is optional)
  const nextToParent = () => {
    if (!form.fullName.trim()) { toast.error("Full name is required"); return; }
    if (form.accountType === "teacher") {
      if (!form.phoneNumber.trim()) { toast.error("Phone number is required"); return; }
      if (!form.subject.trim()) { toast.error("Subject is required"); return; }
      if (!form.assignedClasses.length) { toast.error("Select at least one assigned class"); return; }
      setStep(3);
      return;
    }
    if (!form.dateOfBirth) { toast.error("Date of birth is required"); return; }
    if (!form.gender) { toast.error("Gender is required"); return; }
    if (!form.studentClass) { toast.error("Class is required"); return; }
    if (!form.phoneNumber.trim()) { toast.error("Phone number is required"); return; }
    setStep(2);
  };

  // STEP 2 — parent info validation
  const nextToAccount = () => {
    if (!form.parentName.trim()) { toast.error("Parent/guardian name is required"); return; }
    if (!form.parentPhone.trim()) { toast.error("Parent phone number is required"); return; }
    if (!form.relationship) { toast.error("Relationship is required"); return; }
    setStep(3);
  };

  // STEP 3 — final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) { toast.error("All fields are required"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          studentClass: form.studentClass,
          phoneNumber: form.phoneNumber,
          parentName: form.parentName,
          parentPhone: form.parentPhone,
          parentEmail: form.parentEmail,
          relationship: form.relationship,
          email: form.email,
          password: form.password,
          accessCode: form.accessCode,
          role: form.accountType,
          assignedClasses: form.assignedClasses,
          subject: form.subject,
          qualification: form.qualification,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Account created!");
        router.push("/login/student");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch { toast.error("Something went wrong"); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.35); } 70% { box-shadow: 0 0 0 10px rgba(37,99,235,0); } 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); } }
        .rp-root { min-height: 100vh; background: #0a0f1e; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px 60px; position: relative; overflow: hidden; }
        .rp-blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .rp-blob-1 { width: 420px; height: 420px; background: #1d4ed8; opacity: 0.16; top: -140px; left: -100px; }
        .rp-blob-2 { width: 320px; height: 320px; background: #1e3a8a; opacity: 0.14; bottom: -80px; right: -60px; }
        .rp-grid-bg { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 28px 28px; pointer-events: none; }
        .rp-card { position: relative; z-index: 10; width: 100%; max-width: 500px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 36px 32px 32px; animation: fadeUp 0.7s ease both; }
        @media (max-width: 520px) { .rp-card { padding: 28px 20px 24px; } }
        .rp-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .rp-logo-ring { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rp-school-name { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.2; }
        .rp-school-name span { color: #93c5fd; }
        .rp-steps { display: flex; align-items: center; margin-bottom: 28px; }
        .rp-step { display: flex; align-items: center; gap: 6px; }
        .rp-step-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; flex-shrink: 0; transition: all 0.3s; }
        .rp-step-dot.done { background: #2563EB; color: #fff; }
        .rp-step-dot.active { background: #2563EB; color: #fff; animation: pulse-ring 2s infinite; }
        .rp-step-dot.inactive { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); }
        .rp-step-label { font-family: 'Lato', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .rp-step-label.active { color: #93c5fd; }
        .rp-step-label.done { color: rgba(255,255,255,0.4); }
        .rp-step-label.inactive { color: rgba(255,255,255,0.18); }
        .rp-step-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); margin: 0 5px; }
        .rp-step-line.done { background: rgba(37,99,235,0.5); }
        .rp-heading { margin-bottom: 20px; }
        .rp-eyebrow { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #60a5fa; margin-bottom: 6px; }
        .rp-title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 1.5rem; color: #fff; line-height: 1.15; margin-bottom: 4px; }
        .rp-title em { font-style: italic; color: #93c5fd; }
        .rp-subtitle { font-family: 'Lato', sans-serif; font-weight: 300; font-size: 0.8rem; color: rgba(255,255,255,0.35); line-height: 1.6; }
        .rp-field { margin-bottom: 12px; }
        .rp-label { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-bottom: 6px; display: block; }
        .rp-label span { color: #f87171; margin-left: 2px; }
        .rp-label small { color: rgba(255,255,255,0.25); font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 4px; font-size: 10px; }
        .rp-input, .rp-select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 11px 14px; font-family: 'Lato', sans-serif; font-size: 13px; color: rgba(255,255,255,0.85); outline: none; transition: border-color 0.2s, background 0.2s; -webkit-appearance: none; }
        .rp-input::placeholder { color: rgba(255,255,255,0.2); }
        .rp-input:focus, .rp-select:focus { border-color: rgba(37,99,235,0.6); background: rgba(37,99,235,0.06); }
        .rp-select { cursor: pointer; }
        .rp-select option { background: #1a2035; color: rgba(255,255,255,0.85); }
        .rp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 400px) { .rp-grid-2 { grid-template-columns: 1fr; } }
        .rp-code-input { width: 100%; background: rgba(37,99,235,0.06); border: 1px solid rgba(37,99,235,0.25); border-radius: 8px; padding: 14px 18px; font-family: 'Lato', sans-serif; font-size: 18px; font-weight: 700; letter-spacing: 0.25em; text-align: center; color: #93c5fd; outline: none; transition: border-color 0.2s; text-transform: uppercase; }
        .rp-code-input::placeholder { color: rgba(147,197,253,0.25); letter-spacing: 0.1em; font-size: 13px; font-weight: 400; }
        .rp-code-input:focus { border-color: rgba(37,99,235,0.6); background: rgba(37,99,235,0.1); }
        .rp-info-box { background: rgba(37,99,235,0.08); border: 1px solid rgba(37,99,235,0.18); border-radius: 8px; padding: 11px 14px; margin-bottom: 16px; display: flex; gap: 10px; align-items: flex-start; }
        .rp-info-icon { color: #60a5fa; font-size: 14px; flex-shrink: 0; margin-top: 1px; }
        .rp-info-text { font-family: 'Lato', sans-serif; font-size: 12px; font-weight: 300; color: rgba(147,197,253,0.7); line-height: 1.6; }
        .rp-info-text strong { color: #93c5fd; font-weight: 700; }
        .rp-btn { width: 100%; padding: 13px; border-radius: 8px; font-family: 'Lato', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s, opacity 0.2s; margin-top: 6px; }
        .rp-btn:active { transform: scale(0.98); }
        .rp-btn-primary { background: #2563EB; color: #fff; box-shadow: 0 4px 18px rgba(37,99,235,0.35); }
        .rp-btn-primary:hover { background: #1d4ed8; }
        .rp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .rp-btn-ghost { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); margin-top: 8px; }
        .rp-btn-ghost:hover { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); }
        .rp-btn-google { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 12px; border-radius: 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.75); font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .rp-btn-google:hover { background: rgba(255,255,255,0.1); }
        .rp-btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
        .rp-divider { display: flex; align-items: center; gap: 10px; margin: 14px 0; }
        .rp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .rp-divider-text { font-family: 'Lato', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.18); white-space: nowrap; }
        .rp-foot { font-family: 'Lato', sans-serif; font-size: 12px; color: rgba(255,255,255,0.22); margin-top: 18px; text-align: center; }
        .rp-foot a { color: #60a5fa; text-decoration: none; font-weight: 700; }
        .rp-foot a:hover { color: #93c5fd; }
        .google-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
      `}</style>

      <div className="rp-root">
        <div className="rp-blob rp-blob-1" />
        <div className="rp-blob rp-blob-2" />
        <div className="rp-grid-bg" />

        <div className="rp-card">

          {/* Brand */}
          <div className="rp-brand">
            <div className="rp-logo-ring">
              <img src="/logo.PNG" alt="WFS" width={26} height={26} style={{ objectFit: "contain" }} />
            </div>
            <div className="rp-school-name">
              Winners&apos; <span>Foundation</span> School
            </div>
          </div>

          {/* Step tracker */}
          <div className="rp-steps">
            {STEPS.map((label, i) => {
              const state = i < step ? "done" : i === step ? "active" : "inactive";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "0 0 auto" }}>
                  <div className="rp-step">
                    <div className={`rp-step-dot ${state}`}>
                      {i < step ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : i + 1}
                    </div>
                    <span className={`rp-step-label ${state}`}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`rp-step-line ${i < step ? "done" : ""}`} />}
                </div>
              );
            })}
          </div>

          {/* ── STEP 0: ACCESS CODE ── */}
          {step === 0 && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              <div className="rp-heading">
                <p className="rp-eyebrow">Step 1 of 4</p>
                <h1 className="rp-title">Enter Access <em>Code</em></h1>
                <p className="rp-subtitle">
                  Your access code was provided by the school office. Both new and returning students need this to register.
                </p>
              </div>

              <button className="rp-btn-google" onClick={handleGoogle} disabled={googleLoading}>
                {googleLoading ? <div className="google-spinner" /> : (
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {googleLoading ? "Signing up..." : "Continue with Google"}
              </button>

              <button
                className="rp-btn rp-btn-ghost"
                onClick={() => {
                  update("accountType", "teacher");
                  setStep(1);
                }}
              >
                Register as Teacher
              </button>

              <div className="rp-divider">
                <div className="rp-divider-line" />
                <span className="rp-divider-text">or use access code</span>
                <div className="rp-divider-line" />
              </div>

              <div className="rp-info-box">
                <span className="rp-info-icon">ℹ</span>
                <p className="rp-info-text">
                  Don&apos;t have a code? Contact the school office at <strong>wfsonline1999@gmail.com</strong> or visit in person.
                </p>
              </div>

              <div className="rp-field">
                <label className="rp-label">Access Code <span>*</span></label>
                <input
                  className="rp-code-input"
                  placeholder="Enter your code"
                  value={form.accessCode}
                  onChange={(e) => update("accessCode", e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                  maxLength={30}
                />
              </div>

              <button className="rp-btn rp-btn-primary" onClick={verifyCode} disabled={loading}>
                {loading ? "Verifying..." : "Verify Code →"}
              </button>
            </div>
          )}

          {/* ── STEP 1: STUDENT INFO ── */}
          {step === 1 && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              <div className="rp-heading">
                <p className="rp-eyebrow">Step 2 of 4</p>
                <h1 className="rp-title"><em>{form.accountType === "teacher" ? "Teacher" : "Student"}</em> Information</h1>
                <p className="rp-subtitle">Enter the account details. Fields marked * are required.</p>
              </div>

              <div className="rp-field">
                <label className="rp-label">Full Name <span>*</span></label>
                <input className="rp-input" placeholder="e.g. Chukwuemeka Daniel Obi" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
              </div>

              {form.accountType === "student" && (
                <>
              <div className="rp-grid-2">
                <div className="rp-field">
                  <label className="rp-label">Date of Birth <span>*</span></label>
                  <input type="date" className="rp-input" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} style={{ colorScheme: "dark" }} />
                </div>
                <div className="rp-field">
                  <label className="rp-label">Gender <span>*</span></label>
                  <select className="rp-select" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div className="rp-grid-2">
                <div className="rp-field">
                  <label className="rp-label">Class <span>*</span></label>
                  <select className="rp-select" value={form.studentClass} onChange={(e) => update("studentClass", e.target.value)}>
                    <option value="">Select class</option>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="rp-info-box" style={{ marginBottom: 0 }}>
                  <span className="rp-info-icon">ID</span>
                  <p className="rp-info-text">
                    A student ID will be assigned automatically after account
                    creation.
                  </p>
                </div>
              </div>
                </>
              )}

              {form.accountType === "teacher" && (
                <>
                  <div className="rp-grid-2">
                    <div className="rp-field">
                      <label className="rp-label">Main Subject <span>*</span></label>
                      <input className="rp-input" placeholder="e.g. Mathematics" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
                    </div>
                    <div className="rp-field">
                      <label className="rp-label">Qualification <small>(optional)</small></label>
                      <input className="rp-input" placeholder="e.g. B.Ed" value={form.qualification} onChange={(e) => update("qualification", e.target.value)} />
                    </div>
                  </div>

                  <div className="rp-field">
                    <label className="rp-label">Assigned Classes <span>*</span></label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                      {CLASSES.map((className) => (
                        <label key={className} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.75)", fontFamily: "Lato, sans-serif", fontSize: 12 }}>
                          <input
                            type="checkbox"
                            checked={form.assignedClasses.includes(className)}
                            onChange={(e) => update(
                              "assignedClasses",
                              e.target.checked
                                ? [...form.assignedClasses, className]
                                : form.assignedClasses.filter((item) => item !== className)
                            )}
                          />
                          {className}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="rp-field">
                <label className="rp-label">Phone Number <span>*</span></label>
                <input className="rp-input" placeholder="e.g. 08012345678" value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
              </div>

              <button className="rp-btn rp-btn-primary" onClick={nextToParent}>Continue →</button>
              <button className="rp-btn rp-btn-ghost" onClick={() => setStep(0)}>← Back</button>
            </div>
          )}

          {/* ── STEP 2: PARENT / GUARDIAN ── */}
          {step === 2 && (
            <div style={{ animation: "fadeIn 0.4s ease both" }}>
              <div className="rp-heading">
                <p className="rp-eyebrow">Step 3 of 4</p>
                <h1 className="rp-title"><em>Parent</em> / Guardian</h1>
                <p className="rp-subtitle">Contact information for the student's parent or guardian.</p>
              </div>

              <div className="rp-field">
                <label className="rp-label">Full Name <span>*</span></label>
                <input className="rp-input" placeholder="Parent or guardian's full name" value={form.parentName} onChange={(e) => update("parentName", e.target.value)} />
              </div>

              <div className="rp-grid-2">
                <div className="rp-field">
                  <label className="rp-label">Relationship <span>*</span></label>
                  <select className="rp-select" value={form.relationship} onChange={(e) => update("relationship", e.target.value)}>
                    <option value="">Select</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="rp-field">
                  <label className="rp-label">Phone Number <span>*</span></label>
                  <input className="rp-input" placeholder="080XXXXXXXX" value={form.parentPhone} onChange={(e) => update("parentPhone", e.target.value)} />
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email Address <small>(optional)</small></label>
                <input type="email" className="rp-input" placeholder="parent@email.com" value={form.parentEmail} onChange={(e) => update("parentEmail", e.target.value)} />
              </div>

              <button className="rp-btn rp-btn-primary" onClick={nextToAccount}>Continue →</button>
              <button className="rp-btn rp-btn-ghost" onClick={() => setStep(1)}>← Back</button>
            </div>
          )}

          {/* ── STEP 3: ACCOUNT ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} style={{ animation: "fadeIn 0.4s ease both" }}>
              <div className="rp-heading">
                <p className="rp-eyebrow">Step 4 of 4</p>
                <h1 className="rp-title">Create <em>Account</em></h1>
                <p className="rp-subtitle">Set up the login credentials for the student portal.</p>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email Address <span>*</span></label>
                <input type="email" className="rp-input" placeholder="student@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>

              <div className="rp-field">
                <label className="rp-label">Password <span>*</span></label>
                <input type="password" className="rp-input" placeholder="Min. 6 characters" value={form.password} onChange={(e) => update("password", e.target.value)} />
              </div>

              <div className="rp-field">
                <label className="rp-label">Confirm Password <span>*</span></label>
                <input type="password" className="rp-input" placeholder="Re-enter password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
              </div>

              <div className="rp-info-box" style={{ marginTop: "8px", marginBottom: "14px" }}>
                <span className="rp-info-icon">✓</span>
                <p className="rp-info-text">
                  Registering <strong>{form.fullName}</strong> — <strong>{form.studentClass}</strong>
                </p>
              </div>

              <button type="submit" className="rp-btn rp-btn-primary" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
              <button type="button" className="rp-btn rp-btn-ghost" onClick={() => setStep(2)}>← Back</button>
            </form>
          )}

          <p className="rp-foot">
            Already have an account? <Link href="/login/student">Sign in here</Link>
          </p>

        </div>
      </div>
    </>
  );
}
