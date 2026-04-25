"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap');

        /* Hero */
        .contact-hero {
          background: #0f172a;
          padding: 160px clamp(48px, 10vw, 160px) 80px;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(37,99,235,0.18) 0%, transparent 60%);
        }
        .contact-hero-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 14px;
        }
        .contact-hero-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: clamp(2.4rem, 5vw, 4rem);
          color: white;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .contact-hero-heading em { font-style: italic; color: #60a5fa; }
        .contact-hero-rule {
          width: 52px; height: 3px;
          background: #2563EB; border-radius: 2px; margin-bottom: 24px;
        }
        .contact-hero-sub {
          font-family: 'Lato', sans-serif;
          font-weight: 300; font-size: 1rem;
          color: rgba(255,255,255,0.6);
          max-width: 520px; line-height: 1.8;
        }

        /* Ways to reach us */
        .ways-section {
          background: #f9fafb;
          padding: 72px clamp(48px, 10vw, 160px);
          border-bottom: 1px solid #f0f0f0;
        }
        .ways-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #2563EB; margin-bottom: 12px;
        }
        .ways-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: clamp(1.7rem, 2.5vw, 2.2rem);
          color: #111827; margin-bottom: 14px;
        }
        .ways-rule {
          width: 48px; height: 3px;
          background: #2563EB; border-radius: 2px; margin-bottom: 40px;
        }
        .ways-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) { .ways-grid { grid-template-columns: 1fr; } }
        .way-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 28px 24px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .way-card:hover {
          border-color: #2563EB;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
        }
        .way-icon-wrap {
          width: 44px; height: 44px;
          background: #eff6ff; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .way-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #9CA3AF; margin-bottom: 4px;
        }
        .way-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1rem;
          color: #111827; margin-bottom: 8px;
        }
        .way-value {
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem; color: #4B5563; line-height: 1.7;
        }
        .way-note {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem; color: #9CA3AF;
          margin-top: 6px;
        }

        /* Form section */
        .form-section {
          background: white;
          padding: 90px clamp(48px, 10vw, 160px);
          display: flex;
          gap: 80px;
          align-items: flex-start;
        }
        @media (max-width: 768px) {
          .form-section { flex-direction: column; gap: 48px; }
        }
        .form-info-col {
          flex: 0 0 280px;
        }
        .form-eyebrow {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #2563EB; margin-bottom: 12px;
        }
        .form-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: clamp(1.6rem, 2.5vw, 2.1rem);
          color: #111827; line-height: 1.2; margin-bottom: 16px;
        }
        .form-rule {
          width: 48px; height: 3px;
          background: #2563EB; border-radius: 2px; margin-bottom: 20px;
        }
        .form-intro {
          font-family: 'Lato', sans-serif;
          font-weight: 300; font-size: 0.95rem;
          color: #4B5563; line-height: 1.85; margin-bottom: 28px;
        }
        .hours-block {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          padding: 18px 20px;
        }
        .hours-title {
          font-family: 'Lato', sans-serif;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #2563EB; margin-bottom: 10px;
        }
        .hours-row {
          display: flex;
          justify-content: space-between;
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          color: #374151;
          padding: 5px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .hours-row:last-child { border-bottom: none; }
        .hours-day { font-weight: 400; }
        .hours-time { font-weight: 700; color: #111827; }

        /* Form itself */
        .form-col { flex: 1; }
        .f-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 16px;
        }
        @media (max-width: 500px) { .f-row { grid-template-columns: 1fr; } }
        .f-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .f-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #374151;
        }
        .f-input, .f-select, .f-textarea {
          font-family: 'Lato', sans-serif;
          font-size: 0.93rem; color: #111827;
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 3px; padding: 12px 14px;
          width: 100%; outline: none; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .f-input:focus, .f-select:focus, .f-textarea:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: white;
        }
        .f-textarea { resize: vertical; min-height: 130px; }
        .f-select { appearance: none; cursor: pointer; }
        .submit-btn {
          font-family: 'Lato', sans-serif;
          font-weight: 700; font-size: 0.85rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          background: #2563EB; color: white;
          border: none; padding: 14px 36px;
          cursor: pointer; border-radius: 3px; width: 100%;
          margin-top: 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(37,99,235,0.35);
        }
        .submit-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37,99,235,0.4);
        }
        .form-note {
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem; color: #9CA3AF;
          margin-top: 12px; text-align: center;
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p className="contact-hero-eyebrow">Get In Touch</p>
          <h1 className="contact-hero-heading">We'd Love to<br />Hear <em>From You</em></h1>
          <div className="contact-hero-rule" />
          <p className="contact-hero-sub">
            Whether you have a question about admissions, want to schedule a visit, or simply want to learn more — our team is always happy to help. Reach out through any of the channels below or fill in the form and we'll get back to you promptly.
          </p>
        </div>
      </section>

      {/* Ways to reach us */}
      <section className="ways-section">
        <p className="ways-eyebrow">Reach Us</p>
        <h2 className="ways-heading">How to Contact the School</h2>
        <div className="ways-rule" />
        <div className="ways-grid">

          <div className="way-card">
            <div className="way-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div className="way-label">Find Us</div>
            <div className="way-title">Visit the School</div>
            <p className="way-value">[School Address]<br />[City, State, Nigeria]</p>
            <p className="way-note">Mon – Fri, 7:30am – 3:30pm</p>
          </div>

          <div className="way-card">
            <div className="way-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0115.93 2.18 2 2 0 0118 4.36v3a2 2 0 01-1.56 1.95 16 16 0 00-1.48.56 13 13 0 01-5.61-5.61 16 16 0 00.56-1.48A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div className="way-label">Call Us</div>
            <div className="way-title">Phone & WhatsApp</div>
            <p className="way-value">[Phone Number]</p>
            <p className="way-note">Available during school hours</p>
          </div>

          <div className="way-card">
            <div className="way-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <div className="way-label">Write To Us</div>
            <div className="way-title">Email Address</div>
            <p className="way-value">[School Email Address]</p>
            <p className="way-note">We respond within 1–2 business days</p>
          </div>

        </div>
      </section>

      {/* Form + sidebar */}
      <section className="form-section">

        {/* Left info */}
        <div className="form-info-col">
          <p className="form-eyebrow">Send a Message</p>
          <h2 className="form-heading">Fill In the Form</h2>
          <div className="form-rule" />
          <p className="form-intro">
            Use this form for admissions enquiries, general questions, feedback, or to schedule a school visit. A member of our team will respond as soon as possible.
          </p>

          <div className="hours-block">
            <div className="hours-title">School Hours</div>
            <div className="hours-row">
              <span className="hours-day">Monday – Friday</span>
              <span className="hours-time">7:30am – 3:30pm</span>
            </div>
            <div className="hours-row">
              <span className="hours-day">Saturday</span>
              <span className="hours-time">Closed</span>
            </div>
            <div className="hours-row">
              <span className="hours-day">Sunday</span>
              <span className="hours-time">Closed</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-col">
          <form onSubmit={(e) => { e.preventDefault(); alert("Message sent! We will get back to you shortly."); }}>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">First Name</label>
                <input className="f-input" type="text" placeholder="e.g. Emeka" required />
              </div>
              <div className="f-group">
                <label className="f-label">Last Name</label>
                <input className="f-input" type="text" placeholder="e.g. Okafor" required />
              </div>
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Phone Number</label>
                <input className="f-input" type="tel" placeholder="e.g. 08012345678" />
              </div>
              <div className="f-group">
                <label className="f-label">Email Address</label>
                <input className="f-input" type="email" placeholder="e.g. you@email.com" />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">I Am A</label>
              <select className="f-select" required>
                <option value="">-- Select --</option>
                <option>Parent / Guardian</option>
                <option>Prospective Student</option>
                <option>Current Student</option>
                <option>Staff / Teacher</option>
                <option>Other</option>
              </select>
            </div>
            <div className="f-group">
              <label className="f-label">Subject</label>
              <input className="f-input" type="text" placeholder="e.g. Admission Enquiry" required />
            </div>
            <div className="f-group">
              <label className="f-label">Message</label>
              <textarea className="f-textarea" placeholder="Write your message here..." required />
            </div>
            <button type="submit" className="submit-btn">Send Message →</button>
            <p className="form-note">We typically respond within 1–2 business days.</p>
          </form>
        </div>

      </section>

      <Footer />
    </>
  );
}
