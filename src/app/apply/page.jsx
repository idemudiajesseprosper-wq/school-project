"use client";

import { useState } from "react";
import { toast }  from "react-hot-toast";

const CheckIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const STEPS = [
  { label: "Access Code" },
  { label: "Personal Info" },
  { label: "School Info" },
  { label: "Medical Info" },
  { label: "Parent Info" },
];

export default function Apply() {
  const [code, setCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [touched, setTouched] = useState({
    personal: false, school: false, medical: false, parent: false,
  });

  const getCurrentStep = () => {
    if (!isValid) return 0;
    if (touched.parent) return 4;
    if (touched.medical) return 3;
    if (touched.school) return 2;
    if (touched.personal) return 1;
    return 1;
  };
  const currentStep = getCurrentStep();

  const getStepState = (i) => {
    if (i === 0) return isValid ? "done" : "active";
    if (!isValid) return "pending";
    if (i < currentStep) return "done";
    if (i === currentStep) return "active";
    return "pending";
  };

  const handleVerify = async () => {
    setLoading(true);
    setCodeError("");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.valid) {
        toast.success("Access code verified ✅");
        setIsValid(true);
      } else {
        setCodeError(data.message || "Invalid code. Please check and try again.");
        toast.error(data.message || "Invalid code");
      }
    } catch (err) {
      console.log(err);
      setCodeError("Server error. Please try again.");
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const classApplying = formData.get("classApplying");
    const file = formData.get("passport");
    let imageUrl = "";
    if (file && file.size > 0) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
      const uploadResult = await uploadRes.json();
      imageUrl = uploadResult.url;
    }
    const data = Object.fromEntries(formData);
    data.classApplying = classApplying;
    data.passport = imageUrl;
    data.code = code;
    const res = await fetch("/api/submit-application", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      toast.success("Application submitted successfully 🎉");
      e.target.reset();
      setPreview(null);
      setTouched({ personal: false, school: false, medical: false, parent: false });
    } else {
      toast.error(result.message || "Something went wrong");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Lato:wght@300;400;700&display=swap');

        .ap {
          font-family: 'Lato', sans-serif;
          background: #f0f4f8;
          min-height: 100vh;
          box-sizing: border-box;
        }

        /* ─── STEP TRACKER STRIP ─── */
        .ap-steps-strip {
          background: #0f172a;
          padding: 12px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          overflow-x: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ap-steps-strip::-webkit-scrollbar { display: none; }
        @media (max-width: 700px) { .ap-steps-strip { padding: 10px 16px; justify-content: flex-start; } }

        .ap-step {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px; border-radius: 999px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em;
          white-space: nowrap; transition: all 0.25s;
          font-family: 'Lato', sans-serif;
        }
        .ap-step.done    { background: rgba(37,99,235,0.2); color: #93c5fd; }
        .ap-step.active  { background: #2563EB; color: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.3); }
        .ap-step.pending { color: rgba(255,255,255,0.22); }

        .ap-step-num {
          width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.6rem; font-weight: 700; flex-shrink: 0;
        }
        .done .ap-step-num    { background: #2563EB; color: white; }
        .active .ap-step-num  { background: white; color: #1d4ed8; }
        .pending .ap-step-num { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.2); }
        .ap-step-div { width: 20px; height: 1px; background: rgba(255,255,255,0.08); flex-shrink: 0; }

        /* ─── PAGE BODY ─── */
        .ap-body { max-width: 740px; margin: 0 auto; padding: 44px 24px 80px; }

        /* ─── CARD ─── */
        .ap-card {
          background: white; border-radius: 14px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        .ap-card-head {
          background: linear-gradient(135deg, #0f172a 0%, #1a3050 100%);
          padding: 30px 36px; position: relative; overflow: hidden;
        }
        .ap-card-head::after {
          content: ''; position: absolute; right: -30px; bottom: -50px;
          width: 180px; height: 180px; background: rgba(37,99,235,0.1); border-radius: 50%;
        }
        .ap-card-head-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(37,99,235,0.18); border: 1px solid rgba(96,165,250,0.25);
          color: #93c5fd; font-size: 0.67rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 12px; border-radius: 999px;
          margin-bottom: 12px; position: relative; z-index: 1;
          font-family: 'Lato', sans-serif;
        }
        .ap-card-head-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: clamp(1.35rem, 2.5vw, 1.8rem);
          color: white; line-height: 1.2; margin-bottom: 6px; position: relative; z-index: 1;
        }
        .ap-card-head-title em { color: #60a5fa; font-style: italic; }
        .ap-card-head-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.42);
          font-weight: 300; position: relative; z-index: 1; font-family: 'Lato', sans-serif;
        }

        .ap-card-body { padding: 36px; }
        @media (max-width: 560px) { .ap-card-body { padding: 24px 18px; } }

        /* ─── ACCESS CODE ─── */
        .ap-lock-wrap {
          width: 60px; height: 60px; background: #eff6ff; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 22px;
        }
        .ap-code-label {
          display: block; font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #374151; margin-bottom: 7px; font-family: 'Lato', sans-serif;
        }
        .ap-code-input {
          width: 100%; border: 2px solid #e5e7eb; border-radius: 8px;
          padding: 13px 16px; margin-bottom: 6px;
          font-family: 'Lato', sans-serif; font-size: 1.05rem;
          font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          color: #111827; background: #fafafa; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ap-code-input:focus { border-color: #2563EB; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); background: white; }
        .ap-code-input.err { border-color: #ef4444; }
        .ap-code-err {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.79rem; color: #ef4444; margin-bottom: 14px; font-family: 'Lato', sans-serif;
        }
        .ap-code-btn {
          width: 100%; background: #2563EB; color: white; border: none;
          padding: 14px; border-radius: 8px; margin-top: 6px;
          font-family: 'Lato', sans-serif; font-weight: 700; font-size: 0.87rem;
          letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(37,99,235,0.28);
        }
        .ap-code-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
        .ap-code-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .ap-code-note {
          font-size: 0.74rem; color: #9CA3AF; text-align: center;
          margin-top: 14px; line-height: 1.7; font-family: 'Lato', sans-serif;
        }

        /* ─── FORM ─── */
        .ap-ok-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf4; border: 1px solid #86efac; color: #166534;
          font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 4px 12px; border-radius: 999px;
          margin-bottom: 22px; font-family: 'Lato', sans-serif;
        }

        .ap-section { margin-bottom: 38px; }
        .ap-sec-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 0.97rem; color: #111827;
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 2px solid #eff6ff;
          display: flex; align-items: center; gap: 10px;
        }
        .ap-sec-title::before {
          content: ''; width: 4px; height: 16px;
          background: #2563EB; border-radius: 2px; flex-shrink: 0;
        }

        .ap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 520px) { .ap-grid { grid-template-columns: 1fr; } }
        .ap-full { grid-column: 1 / -1; }

        .ap-f { display: flex; flex-direction: column; gap: 5px; }
        .ap-lbl {
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase; color: #374151;
          font-family: 'Lato', sans-serif;
        }
        .ap-in, .ap-sel {
          font-family: 'Lato', sans-serif; font-size: 0.89rem;
          color: #111827; background: #fafafa;
          border: 1.5px solid #e5e7eb; border-radius: 7px;
          padding: 10px 12px; outline: none; width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ap-in:focus, .ap-sel:focus {
          border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37,99,235,0.09); background: white;
        }
        .ap-sel { appearance: none; cursor: pointer; }

        /* Passport upload */
        .ap-pass-row { display: flex; gap: 24px; align-items: flex-start; margin-bottom: 18px; }
        @media (max-width: 520px) { .ap-pass-row { flex-direction: column; } }
        .ap-pass-box {
          width: 112px; height: 132px; flex-shrink: 0;
          border: 2px dashed #d1d5db; border-radius: 10px;
          overflow: hidden; position: relative; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: #f9fafb; transition: border-color 0.2s, background 0.2s;
        }
        .ap-pass-box:hover { border-color: #2563EB; background: #eff6ff; }
        .ap-pass-box input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
        .ap-pass-ph {
          display: flex; flex-direction: column; align-items: center;
          gap: 7px; color: #9CA3AF; text-align: center; padding: 10px; pointer-events: none;
        }
        .ap-pass-ph span { font-size: 0.68rem; line-height: 1.4; font-family: 'Lato', sans-serif; }
        .ap-pass-img { width: 100%; height: 100%; object-fit: cover; }

        /* ─── INLINE BLANK INPUT ─── */
        /* Used inside prose sentences for fillable gaps */
        .ap-blank {
          display: inline-block;
          border: none;
          border-bottom: 1.5px solid #2563EB;
          background: transparent;
          outline: none;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          color: #111827;
          padding: 1px 4px;
          min-width: 160px;
          transition: border-color 0.2s, background 0.2s;
          vertical-align: baseline;
        }
        .ap-blank:focus {
          border-bottom-color: #1d4ed8;
          background: #eff6ff;
          border-radius: 3px 3px 0 0;
        }
        .ap-blank.sm { min-width: 90px; }
        .ap-blank.md { min-width: 140px; }
        .ap-blank.lg { min-width: 220px; }

        /* ─── DECLARATION BOXES ─── */
        .ap-declaration {
          background: #fafbff;
          border: 1.5px solid #e0e7ff;
          border-radius: 10px;
          padding: 22px 24px;
          margin-bottom: 20px;
        }
        .ap-declaration-title {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #2563EB; margin-bottom: 12px;
        }
        .ap-declaration p {
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem; color: #374151;
          line-height: 1.85;
        }
        .ap-declaration strong { color: #111827; }

        /* ─── SIGNATURE ROW ─── */
        .ap-sig-row {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 16px;
          align-items: end;
          margin-top: 28px;
        }
        @media (max-width: 520px) {
          .ap-sig-row { grid-template-columns: 1fr; }
          .ap-sig-divider { display: none; }
        }
        .ap-sig-field { display: flex; flex-direction: column; gap: 5px; }
        .ap-sig-label {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #6B7280; font-family: 'Lato', sans-serif;
        }
        .ap-sig-line {
          border: none; border-bottom: 1.5px solid #d1d5db;
          background: transparent; outline: none;
          font-family: 'Lato', sans-serif; font-size: 0.89rem;
          color: #111827; padding: 8px 4px; width: 100%;
          transition: border-color 0.2s;
        }
        .ap-sig-line:focus { border-bottom-color: #2563EB; }
        .ap-sig-divider {
          width: 1px; height: 40px; background: #e5e7eb; align-self: end; margin-bottom: 2px;
        }

        /* ─── NOTE BOX ─── */
        .ap-note-box {
          background: #fffbeb;
          border-left: 3px solid #f59e0b;
          border-radius: 0 6px 6px 0;
          padding: 12px 16px;
          margin-bottom: 20px;
          font-family: 'Lato', sans-serif;
          font-size: 0.82rem;
          color: #92400e;
          line-height: 1.6;
        }

        /* Submit */
        .ap-submit {
          width: 100%; background: #0f172a; color: white; border: none;
          padding: 15px; border-radius: 8px; margin-top: 6px;
          font-family: 'Lato', sans-serif; font-weight: 700; font-size: 0.88rem;
          letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
        }
        .ap-submit:hover { background: #1e293b; transform: translateY(-1px); }
        .ap-submit-note {
          text-align: center; font-size: 0.73rem;
          color: #9CA3AF; margin-top: 10px; line-height: 1.6; font-family: 'Lato', sans-serif;
        }

        /* Footer */
        .ap-footer {
          border-top: 1px solid #f0f0f0; padding: 18px 36px;
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 0.76rem; color: #b0b7c3; text-align: center;
        }
      `}</style>

      <div className="ap pt-[120px]">

        {/* ── STEP TRACKER STRIP ── */}
        <div className="ap-steps-strip">
          {STEPS.map((s, i) => {
            const state = getStepState(i);
            return (
              <div key={s.label} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <div className="ap-step-div" />}
                <div className={`ap-step ${state}`}>
                  <div className="ap-step-num">
                    {state === "done" ? <CheckIcon size={9} /> : i + 1}
                  </div>
                  <span>{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── BODY ── */}
        <div className="ap-body">
          <div className="ap-card">

            {/* Dark header */}
            <div className="ap-card-head">
              <div className="ap-card-head-badge">
                {isValid ? <><CheckIcon size={9} /> Verified &amp; In Progress</> : "Admission Application 2025/2026"}
              </div>
              <h1 className="ap-card-head-title">
                {isValid ? <>Student <em>Admission</em> Form</> : <>Enter Your <em>Access Code</em></>}
              </h1>
              <p className="ap-card-head-sub">
                {isValid
                  ? "Fill in all fields carefully. All information provided must be accurate."
                  : "An access code is required to begin. Contact the school office if you don't have one."}
              </p>
            </div>

            {/* Body */}
            <div className="ap-card-body">

              {!isValid ? (
                <div style={{ maxWidth: 400 }}>
                  <div className="ap-lock-wrap">🔒</div>
                  <label className="ap-code-label">Your Access Code</label>
                  <input
                    type="text"
                    className={`ap-code-input${codeError ? " err" : ""}`}
                    placeholder="e.g. WFS-2026-1234"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setCodeError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  />
                  {codeError && (
                    <p className="ap-code-err">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {codeError}
                    </p>
                  )}
                  <button className="ap-code-btn" onClick={handleVerify} disabled={loading || !code.trim()}>
                    {loading ? "Verifying..." : "Verify & Continue →"}
                  </button>
                  <p className="ap-code-note">
                    Access codes are issued by the school administration.<br />
                    Contact us at <strong>[school phone/email]</strong> to obtain yours.
                  </p>
                </div>

              ) : (
                <div>
                  <div className="ap-ok-badge"><CheckIcon size={9} /> Code Verified</div>

                  <form onSubmit={handleSubmit}>

                    {/* ── Personal Info ── */}
                    <div className="ap-section" onFocus={() => setTouched(t => ({ ...t, personal: true }))}>
                      <div className="ap-sec-title">Personal Information</div>
                      <div className="ap-pass-row">
                        <div>
                          <label className="ap-lbl" style={{ display: "block", marginBottom: 6 }}>Passport Photo</label>
                          <label className="ap-pass-box">
                            <input type="file" name="passport" accept="image/*" required
                              onChange={(e) => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); }}
                            />
                            {preview
                              ? <img src={preview} className="ap-pass-img" alt="Preview" />
                              : <div className="ap-pass-ph">
                                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                                    <circle cx="8.5" cy="8.5" r="1.5"/>
                                    <path d="M21 15l-5-5L5 21"/>
                                  </svg>
                                  <span>Click to upload</span>
                                </div>
                            }
                          </label>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="ap-grid">
                            <div className="ap-f ap-full">
                              <label className="ap-lbl">Full Name</label>
                              <input name="fullName" className="ap-in" placeholder="As it appears on birth certificate" required />
                            </div>
                            <div className="ap-f">
                              <label className="ap-lbl">Sex</label>
                              <select name="sex" className="ap-sel" required>
                                <option value="">Select</option>
                                <option>Male</option><option>Female</option>
                              </select>
                            </div>
                            <div className="ap-f">
                              <label className="ap-lbl">Date of Birth</label>
                              <input name="dateOfBirth" type="date" className="ap-in" required />
                            </div>
                            <div className="ap-f">
                              <label className="ap-lbl">Phone Number</label>
                              <input name="phone" className="ap-in" placeholder="e.g. 08012345678" />
                            </div>
                            <div className="ap-f">
                              <label className="ap-lbl">Religion</label>
                              <input name="religion" className="ap-in" placeholder="e.g. Christianity" />
                            </div>
                            <div className="ap-f ap-full">
                              <label className="ap-lbl">Residential Address</label>
                              <input name="address" className="ap-in" placeholder="Full home address" required />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ap-grid">
                        <div className="ap-f">
                          <label className="ap-lbl">Native Town</label>
                          <input name="nativeTown" className="ap-in" placeholder="e.g. Benin City" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">State of Origin</label>
                          <input name="state" className="ap-in" placeholder="e.g. Edo State" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Nationality</label>
                          <input name="nationality" className="ap-in" placeholder="e.g. Nigerian" />
                        </div>
                      </div>
                    </div>

                    {/* ── School Info ── */}
                    <div className="ap-section" onFocus={() => setTouched(t => ({ ...t, school: true }))}>
                      <div className="ap-sec-title">School Information</div>
                      <div className="ap-grid">
                        <div className="ap-f ap-full">
                          <label className="ap-lbl">Previous School Attended</label>
                          <input name="previousSchool" className="ap-in" placeholder="Name of last school attended" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Last Class Passed</label>
                          <input name="lastClassPassed" className="ap-in" placeholder="e.g. JSS 2" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Class Applying For</label>
                          <select name="classApplying" className="ap-sel" required>
                            <option value="">Select Class</option>
                            <option value="Nursery 1">Nursery 1</option><option value="Nursery 2">Nursery 2</option>
                            <option value="Primary 1">Primary 1</option><option value="Primary 2">Primary 2</option>
                            <option value="Primary 3">Primary 3</option><option value="Primary 4">Primary 4</option>
                            <option value="Primary 5">Primary 5</option><option value="Primary 6">Primary 6</option>
                            <option value="JSS 1">JSS 1</option><option value="JSS 2">JSS 2</option><option value="JSS 3">JSS 3</option>
                            <option value="SSS 1">SSS 1</option><option value="SSS 2">SSS 2</option><option value="SSS 3">SSS 3</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* ── Medical Info ── */}
                    <div className="ap-section" onFocus={() => setTouched(t => ({ ...t, medical: true }))}>
                      <div className="ap-sec-title">Medical Information</div>
                      <div className="ap-grid">
                        <div className="ap-f">
                          <label className="ap-lbl">Any Disability?</label>
                          <input name="disability" className="ap-in" placeholder="e.g. None" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Health Condition</label>
                          <input name="healthCondition" className="ap-in" placeholder="e.g. Asthma, None" />
                        </div>
                        <div className="ap-f ap-full">
                          <label className="ap-lbl">Special Attention Needed</label>
                          <input name="specialAttention" className="ap-in" placeholder="Any special needs or requirements" />
                        </div>
                      </div>
                    </div>

                    {/* ── Parent / Guardian Info ── */}
                    <div className="ap-section" onFocus={() => setTouched(t => ({ ...t, parent: true }))}>
                      <div className="ap-sec-title">Parent / Guardian Information</div>
                      <div className="ap-grid">
                        <div className="ap-f ap-full">
                          <label className="ap-lbl">Parent / Guardian Full Name</label>
                          <input name="parentName" className="ap-in" placeholder="Full name" required />
                        </div>
                        <div className="ap-f ap-full">
                          <label className="ap-lbl">Parent Address</label>
                          <input name="parentAddress" className="ap-in" placeholder="Home address" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Occupation</label>
                          <input name="parentOccupation" className="ap-in" placeholder="e.g. Teacher, Engineer" />
                        </div>
                        <div className="ap-f">
                          <label className="ap-lbl">Phone Number</label>
                          <input name="parentPhone" className="ap-in" placeholder="e.g. 08012345678" required />
                        </div>
                      </div>
                    </div>

                    {/* ── Parent's Undertaking ── */}
                    <div className="ap-section">
                      <div className="ap-sec-title">Parent's Undertaking</div>
                      <div className="ap-declaration">
                        <div className="ap-declaration-title">Declaration by Parent / Guardian</div>
                        <p>
                          I{" "}
                          <input
                            type="text"
                            name="parentUndertakingName"
                            className="ap-blank lg"
                            placeholder="full name of parent/guardian"
                            required
                          />
                          {" "}hereby undertake to be responsible for any act(s) done by my child/ward
                          during the school, to comply with the rules and regulations and to cooperate
                          fully with the management of{" "}
                          <strong>WINNERS' FOUNDATION SCHOOL</strong>{" "}
                          in all school's programmes and endeavour to attain the best standard and
                          objective of the institute.
                        </p>
                      </div>

                      <div className="ap-note-box">
                        <strong>NOTE:</strong> Your child is in the care of the school only during school hours.
                      </div>

                      {/* Signature row for parent */}
                      <div className="ap-sig-row">
                        <div className="ap-sig-field">
                          <span className="ap-sig-label">Parent's Signature</span>
                          <input
                            type="text"
                            name="parentSignature"
                            className="ap-sig-line"
                            placeholder="Type full name as signature"
                            required
                          />
                        </div>
                        <div className="ap-sig-divider" />
                        <div className="ap-sig-field">
                          <span className="ap-sig-label">Date</span>
                          <input
                            type="date"
                            name="parentSignatureDate"
                            className="ap-sig-line"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Pupil's Pledge ── */}
                    <div className="ap-section">
                      <div className="ap-sec-title">Pupil / Student's Pledge</div>
                      <div className="ap-declaration">
                        <div className="ap-declaration-title">Pledge by Student</div>
                        <p>
                          I{" "}
                          <input
                            type="text"
                            name="pupilPledgeName"
                            className="ap-blank lg"
                            placeholder="full name of student"
                            required
                          />
                          {" "}pledge to be loyal, obedient, honest and law abiding at all times as a
                          student/pupil of <strong>WINNERS' FOUNDATION SCHOOLS.</strong>
                        </p>
                      </div>

                      {/* Signature row for pupil */}
                      <div className="ap-sig-row">
                        <div className="ap-sig-field">
                          <span className="ap-sig-label">Pupil's / Student's Signature</span>
                          <input
                            type="text"
                            name="pupilSignature"
                            className="ap-sig-line"
                            placeholder="Type full name as signature"
                          />
                        </div>
                        <div className="ap-sig-divider" />
                        <div className="ap-sig-field">
                          <span className="ap-sig-label">Date</span>
                          <input
                            type="date"
                            name="pupilSignatureDate"
                            className="ap-sig-line"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Submit ── */}
                    <button type="submit" className="ap-submit">Submit Application →</button>
                    <p className="ap-submit-note">By submitting, you confirm all information provided is accurate and complete.</p>

                  </form>
                </div>
              )}
            </div>

            <div className="ap-footer">
              "Excellence through Faith and Industry" — Winners' Foundation School, Benin City
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
