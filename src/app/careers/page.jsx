"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const SUBJECTS = [
  "Early Years",
  "Primary Class Teacher",
  "English Language",
  "Mathematics",
  "Basic Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Computer Studies",
  "Economics",
  "Government",
  "Christian Religious Studies",
  "Other",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  qualification: "",
  yearsOfExperience: "",
  currentLocation: "",
  coverLetter: "",
  website: "",
};

export default function CareersPage() {
  const [form, setForm] = useState(initialForm);
  const [cv, setCv] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadCv() {
    if (!cv) throw new Error("Please upload your CV.");

    const uploadData = new FormData();
    uploadData.append("file", cv);
    uploadData.append("folder", "school-portal/teacher-applications/cvs");

    const res = await fetch("/api/upload", {
      method: "POST",
      body: uploadData,
    });
    const json = await res.json();

    if (!json.success) {
      throw new Error(json.error || "CV upload failed");
    }

    return json;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const upload = await uploadCv();
      const res = await fetch("/api/teacher-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cvUrl: upload.url,
          cvFileName: upload.originalName || cv.name,
        }),
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Could not submit application");
      }

      toast.success("Application submitted successfully");
      setSubmitted(true);
      setForm(initialForm);
      setCv(null);
    } catch (error) {
      toast.error(error.message || "Could not submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700;900&display=swap');

        .careers-page {
          min-height: 100vh;
          background: #f9fafb;
          color: #111827;
        }

        .careers-hero {
          position: relative;
          overflow: hidden;
          background: #0f172a;
          padding: 120px clamp(22px, 8vw, 120px) 72px;
          color: white;
        }
        .careers-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 82% 28%, rgba(37,99,235,0.24), transparent 58%);
          pointer-events: none;
        }
        .careers-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 42px;
          align-items: end;
        }
        .careers-eyebrow,
        .careers-section-eyebrow,
        .careers-label {
          font-family: 'Lato', sans-serif;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .careers-eyebrow {
          font-size: 0.68rem;
          color: #60a5fa;
          margin-bottom: 14px;
        }
        .careers-title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.35rem, 5.2vw, 4.2rem);
          line-height: 1.08;
          max-width: 760px;
          margin: 0;
        }
        .careers-title em {
          color: #93c5fd;
          font-style: italic;
        }
        .careers-hero-rule {
          width: 54px;
          height: 3px;
          background: #2563EB;
          border-radius: 2px;
          margin: 24px 0;
        }
        .careers-sub {
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.85;
          color: rgba(255,255,255,0.68);
          max-width: 560px;
        }
        .careers-facts {
          display: grid;
          gap: 0;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 6px;
          overflow: hidden;
        }
        .careers-fact {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 17px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          color: rgba(255,255,255,0.72);
        }
        .careers-fact:last-child { border-bottom: none; }
        .careers-fact strong {
          color: white;
          font-size: 0.82rem;
          text-align: right;
          white-space: nowrap;
        }

        .careers-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: 72px clamp(22px, 5vw, 40px) 88px;
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 56px;
          align-items: start;
        }
        .careers-section-eyebrow {
          font-size: 0.68rem;
          color: #2563EB;
          margin-bottom: 12px;
        }
        .careers-side-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3vw, 2.35rem);
          font-weight: 900;
          line-height: 1.12;
          color: #111827;
          margin: 0 0 16px;
        }
        .careers-side-rule {
          width: 48px;
          height: 3px;
          border-radius: 2px;
          background: #2563EB;
          margin-bottom: 22px;
        }
        .careers-side-text {
          font-family: 'Lato', sans-serif;
          font-weight: 300;
          color: #4B5563;
          line-height: 1.85;
          margin-bottom: 28px;
        }
        .careers-checklist {
          display: grid;
          gap: 12px;
        }
        .careers-check {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 4px;
          padding: 15px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.55;
          color: #374151;
        }
        .careers-check-mark {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563EB;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 20px;
          font-size: 0.72rem;
          margin-top: 1px;
        }

        .careers-form {
          display: grid;
          gap: 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 4px;
          padding: clamp(22px, 4vw, 34px);
          box-shadow: 0 12px 38px rgba(15,23,42,0.08);
        }
        .careers-success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          border-radius: 4px;
          padding: 14px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.6;
          color: #166534;
        }
        .careers-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .careers-label {
          display: grid;
          gap: 7px;
          min-width: 0;
          font-size: 0.7rem;
          color: #4B5563;
        }
        .careers-label-full { grid-column: 1 / -1; }
        .careers-input,
        .careers-select,
        .careers-textarea,
        .careers-file {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 3px;
          padding: 13px 14px;
          font-family: 'Lato', sans-serif;
          font-size: 0.94rem;
          font-weight: 400;
          letter-spacing: 0;
          text-transform: none;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .careers-input:focus,
        .careers-select:focus,
        .careers-textarea:focus,
        .careers-file:focus {
          border-color: #2563EB;
          background: white;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        .careers-textarea {
          resize: vertical;
          min-height: 138px;
          line-height: 1.7;
        }
        .careers-file {
          border-style: dashed;
          padding: 12px;
          color: #475569;
        }
        .careers-file::file-selector-button {
          border: 0;
          border-radius: 3px;
          background: #2563EB;
          color: white;
          font-family: 'Lato', sans-serif;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 10px 14px;
          margin-right: 14px;
          cursor: pointer;
        }
        .careers-selected {
          font-family: 'Lato', sans-serif;
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
          color: #64748b;
          overflow-wrap: anywhere;
        }
        .careers-submit {
          border: 0;
          border-radius: 3px;
          background: #2563EB;
          color: white;
          cursor: pointer;
          padding: 15px 22px;
          font-family: 'Lato', sans-serif;
          font-size: 0.84rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(37,99,235,0.28);
        }
        .careers-submit:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(37,99,235,0.34);
        }
        .careers-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 860px) {
          .careers-hero {
            padding: 92px 22px 48px;
          }
          .careers-hero-inner,
          .careers-content {
            grid-template-columns: 1fr;
          }
          .careers-hero-inner {
            gap: 28px;
          }
          .careers-content {
            padding: 48px 22px 64px;
            gap: 34px;
          }
          .careers-title {
            font-size: clamp(2.1rem, 10vw, 3rem);
          }
          .careers-sub {
            font-size: 0.95rem;
            line-height: 1.75;
          }
          .careers-fact {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
            padding: 14px 16px;
          }
          .careers-fact strong {
            text-align: left;
            white-space: normal;
          }
          .careers-form-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .careers-form {
            gap: 18px;
          }
          .careers-submit {
            width: 100%;
            padding-inline: 12px;
          }
          .careers-file::file-selector-button {
            width: 100%;
            margin: 0 0 10px;
          }
        }
      `}</style>

      <main className="careers-page">
        <section className="careers-hero">
          <div className="careers-hero-inner">
            <div>
              <p className="careers-eyebrow">Careers</p>
              <h1 className="careers-title">
                Apply to teach at <em>Winners'</em> Foundation School
              </h1>
              <div className="careers-hero-rule" />
              <p className="careers-sub">
                We welcome committed teachers who can combine academic
                excellence, discipline, and genuine care for children.
              </p>
            </div>
            <div className="careers-facts">
              <div className="careers-fact">
                <span>CV format</span>
                <strong>PDF, DOC, DOCX</strong>
              </div>
              <div className="careers-fact">
                <span>Maximum file size</span>
                <strong>5MB</strong>
              </div>
              <div className="careers-fact">
                <span>Response channel</span>
                <strong>Email or phone</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="careers-content">
          <aside>
            <p className="careers-section-eyebrow">What we look for</p>
            <h2 className="careers-side-title">Teachers who lead with care</h2>
            <div className="careers-side-rule" />
            <p className="careers-side-text">
              Strong subject knowledge, classroom control, clear communication,
              and a heart for building students of character.
            </p>
            <div className="careers-checklist">
              {[
                "Professional conduct",
                "Lesson preparation and assessment skills",
                "Ability to work with school leadership",
                "Respect for faith-based school values",
              ].map((item) => (
                <div key={item} className="careers-check">
                  <span className="careers-check-mark">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="careers-form">
            {submitted && (
              <div className="careers-success">
                Your application has been received. Thank you for your interest.
              </div>
            )}

            <div className="careers-form-grid">
              <Input
                label="Full name"
                name="fullName"
                value={form.fullName}
                onChange={updateField}
                required
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                required
              />
              <Input
                label="Phone number"
                name="phone"
                value={form.phone}
                onChange={updateField}
                required
              />
              <Select
                label="Subject or role"
                name="subject"
                value={form.subject}
                onChange={updateField}
                options={SUBJECTS}
                required
              />
              <Input
                label="Highest qualification"
                name="qualification"
                value={form.qualification}
                onChange={updateField}
                required
              />
              <Input
                label="Years of experience"
                name="yearsOfExperience"
                type="number"
                min="0"
                value={form.yearsOfExperience}
                onChange={updateField}
              />
              <Input
                label="Current location"
                name="currentLocation"
                value={form.currentLocation}
                onChange={updateField}
                full
              />
            </div>

            <label className="careers-label">
              Short cover note
              <textarea
                value={form.coverLetter}
                onChange={(event) =>
                  updateField("coverLetter", event.target.value)
                }
                rows={5}
                maxLength={1200}
                className="careers-textarea"
                placeholder="Tell us briefly about your teaching experience and the classes you are comfortable handling."
              />
            </label>

            <label className="careers-label">
              Upload CV
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required
                onChange={(event) => setCv(event.target.files?.[0] || null)}
                className="careers-file"
              />
              {cv && (
                <span className="careers-selected">Selected: {cv.name}</span>
              )}
            </label>

            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={submitting}
              className="careers-submit"
            >
              {submitting ? "Submitting application..." : "Submit application"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  full,
  min,
}) {
  return (
    <label className={`careers-label ${full ? "careers-label-full" : ""}`}>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="careers-input"
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, required }) {
  return (
    <label className="careers-label">
      {label}
      <select
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="careers-select"
      >
        <option value="">Select an option</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
